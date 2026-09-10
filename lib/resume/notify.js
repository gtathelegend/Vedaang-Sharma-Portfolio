import nodemailer from "nodemailer";
import { getPostHogClient } from "../posthog-server.js";

// In-memory cooldown store to prevent email flooding from rapid repeated clicks.
// Key: IP address -> timestamp of last sent email (ms)
const memoryCooldownStore = new Map();
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes cooldown per IP

/**
 * Extracts client IP using trusted server/platform headers without accepting arbitrary frontend parameters.
 * Designed for Vercel, Cloudflare, and Node.js proxy environments.
 *
 * @param {Request} request
 * @returns {string}
 */
export function extractClientIp(request) {
  // 1. x-forwarded-for (Vercel & standard reverse proxies: first IP is the original client)
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const firstIp = xff.split(",")[0].trim();
    if (firstIp && firstIp !== "unknown") return firstIp;
  }

  // 2. x-real-ip
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp !== "unknown") return realIp.trim();

  // 3. cf-connecting-ip (Cloudflare)
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && cfIp !== "unknown") return cfIp.trim();

  // 4. x-vercel-ip (Vercel edge)
  const vercelIp = request.headers.get("x-vercel-ip");
  if (vercelIp && vercelIp !== "unknown") return vercelIp.trim();

  // 5. Next.js internal request.ip if present
  if (request.ip && typeof request.ip === "string" && request.ip !== "unknown") {
    return request.ip.trim();
  }

  return "Not available";
}

/**
 * Checks if the IP is currently in the duplicate notification cooldown window.
 * Returns true if notification should be throttled (skipped).
 *
 * @param {string} ip
 * @returns {Promise<boolean>}
 */
export async function isNotificationOnCooldown(ip) {
  if (!ip || ip === "Not available" || ip === "unknown") return false;

  // Check Upstash Redis if configured for distributed serverless instances
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({ url: upstashUrl, token: upstashToken });
      const key = `cooldown:resume_email:${ip}`;
      // Set key with 120s TTL only if it doesn't exist (NX)
      const acquired = await redis.set(key, "1", { nx: true, ex: 120 });
      // If acquired is null, key already existed -> currently on cooldown
      return acquired === null;
    } catch (err) {
      console.warn("[RESUME NOTIFICATION] Upstash cooldown check failed, falling back to memory:", err?.message || err);
    }
  }

  // Fallback: in-memory store
  const now = Date.now();
  const lastTime = memoryCooldownStore.get(ip);
  if (lastTime && now - lastTime < COOLDOWN_MS) {
    return true;
  }
  memoryCooldownStore.set(ip, now);

  // Clean up old entries periodically
  if (memoryCooldownStore.size > 500) {
    for (const [storedIp, timestamp] of memoryCooldownStore.entries()) {
      if (now - timestamp > COOLDOWN_MS) {
        memoryCooldownStore.delete(storedIp);
      }
    }
  }

  return false;
}

/**
 * Extracts complete download metadata from request with server-generated timestamps.
 *
 * @param {Request} request
 * @param {string} [filename='Vedaang_Sharma_Resume.pdf']
 * @returns {object}
 */
export function extractDownloadMetadata(request, filename = "Vedaang_Sharma_Resume.pdf") {
  const ip = extractClientIp(request);
  const userAgent = request.headers.get("user-agent") || "Not available";
  const referer =
    request.headers.get("referer") ||
    request.headers.get("referrer") ||
    "Direct / Not available";

  let downloadUrl = "/api/download-resume";
  try {
    const parsed = new URL(request.url);
    downloadUrl = parsed.pathname + parsed.search;
  } catch {
    downloadUrl = request.url || "/api/download-resume";
  }

  const now = new Date();
  const timestampIso = now.toISOString();

  let timestampFormatted;
  try {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    }).format(now);
    timestampFormatted = `${formattedDate} IST`;
  } catch {
    timestampFormatted = now.toUTCString();
  }

  return {
    filename,
    ip,
    userAgent,
    referer,
    downloadUrl,
    timestampIso,
    timestampFormatted,
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatField(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }
  return String(value);
}

/**
 * Sends the notification email with full download, geolocation, network, and browser details.
 * Never throws — failures are logged to server console.
 *
 * @param {object} params
 * @param {object} params.metadata
 * @param {object} [params.geo]
 * @returns {Promise<{ success: boolean, skipped?: boolean, reason?: string, provider?: string, error?: string }>}
 */
export async function sendResumeNotification({ metadata, geo = {} }) {
  try {
    const {
      filename,
      ip,
      userAgent,
      referer,
      downloadUrl,
      timestampIso,
      timestampFormatted,
    } = metadata;

    // Track analytics via PostHog if available
    const posthog = getPostHogClient();
    if (posthog) {
      try {
        posthog.capture({
          distinctId: `resume:${ip}`,
          event: "resume_downloaded",
          properties: {
            filename,
            ip,
            userAgent,
            referer,
            downloadUrl,
            timestamp: timestampIso,
            country: geo.country || null,
            city: geo.city || null,
            isp: geo.isp || null,
          },
        });
      } catch (phErr) {
        console.warn("[RESUME NOTIFICATION] PostHog capture warning:", phErr?.message || phErr);
      }
    }

    // Check duplicate cooldown
    const onCooldown = await isNotificationOnCooldown(ip);
    if (onCooldown) {
      console.log(`[RESUME NOTIFICATION] Duplicate download within cooldown window from ${ip}. Skipping notification email.`);
      return { skipped: true, reason: "cooldown" };
    }

    // Determine site host for subject line
    let siteDomain = "vedaangsharma.in";
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        siteDomain = new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname;
      } catch {
        // keep fallback
      }
    }

    const subject = `Resume Downloaded — ${siteDomain}`;

    // Values formatted with "Not available" fallback
    const displayResume = formatField(filename);
    const displayTimestamp = `${formatField(timestampFormatted)} (${timestampIso})`;
    const displayUrl = formatField(downloadUrl);
    const displayIp = formatField(ip);
    const displayCountry = formatField(
      geo.country ? (geo.countryCode ? `${geo.country} (${geo.countryCode})` : geo.country) : null
    );
    const displayRegion = formatField(
      geo.regionName || geo.region
    );
    const displayCity = formatField(geo.city);
    const displayZip = formatField(geo.zip);
    const displayTimezone = formatField(geo.timezone);
    const displayCoordinates =
      geo.latitude != null && geo.longitude != null
        ? `${geo.latitude}, ${geo.longitude}`
        : "Not available";
    const displayIsp = formatField(geo.isp);
    const displayOrganization = formatField(geo.organization);
    const displayAsn = formatField(geo.asn);
    const displayAsName = formatField(geo.asName);
    const displayUserAgent = formatField(userAgent);
    const displayReferrer = formatField(referer);

    // Plain text content (concise, easy to scan, exact requested sections)
    const text = [
      `Download`,
      `Resume: ${displayResume}`,
      `Downloaded at: ${displayTimestamp}`,
      `Download URL: ${displayUrl}`,
      ``,
      `Visitor`,
      `IP Address: ${displayIp}`,
      `Country: ${displayCountry}`,
      `Region: ${displayRegion}`,
      `City: ${displayCity}`,
      `ZIP: ${displayZip}`,
      `Timezone: ${displayTimezone}`,
      `Coordinates: ${displayCoordinates}`,
      ``,
      `Network`,
      `ISP: ${displayIsp}`,
      `Organization: ${displayOrganization}`,
      `ASN: ${displayAsn}`,
      `AS Name: ${displayAsName}`,
      ``,
      `Browser`,
      `User-Agent: ${displayUserAgent}`,
      `Referrer: ${displayReferrer}`,
    ].join("\n");

    // Professional HTML content
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;line-height:1.6;max-width:620px;margin:0 auto;padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
        <div style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:20px;">
          <h2 style="margin:0 0 6px;font-size:20px;color:#0f172a;font-weight:700;">Resume Downloaded</h2>
          <p style="margin:0;color:#64748b;font-size:14px;">A visitor has downloaded your resume from your portfolio website.</p>
        </div>

        <!-- Download Section -->
        <div style="margin-bottom:18px;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#0284c7;margin-bottom:8px;">Download Details</div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;background:#f8fafc;border-radius:8px;padding:8px;">
            <tbody>
              <tr>
                <td style="padding:8px 12px;color:#64748b;width:130px;font-weight:600;">Resume</td>
                <td style="padding:8px 12px;color:#0f172a;font-weight:700;">${escapeHtml(displayResume)}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;color:#64748b;font-weight:600;">Downloaded at</td>
                <td style="padding:8px 12px;color:#0f172a;">${escapeHtml(displayTimestamp)}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;color:#64748b;font-weight:600;">Download URL</td>
                <td style="padding:8px 12px;color:#0f172a;font-family:monospace;font-size:12px;">${escapeHtml(displayUrl)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Visitor Location Section -->
        <div style="margin-bottom:18px;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#0d9488;margin-bottom:8px;">Visitor Location</div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;background:#f8fafc;border-radius:8px;padding:8px;">
            <tbody>
              <tr>
                <td style="padding:6px 12px;color:#64748b;width:130px;font-weight:600;">IP Address</td>
                <td style="padding:6px 12px;color:#0f172a;"><code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;">${escapeHtml(displayIp)}</code></td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">Country</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayCountry)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">Region</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayRegion)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">City</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayCity)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">ZIP Code</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayZip)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">Timezone</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayTimezone)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">Coordinates</td>
                <td style="padding:6px 12px;color:#0f172a;font-family:monospace;font-size:12px;">${escapeHtml(displayCoordinates)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Network Info Section -->
        <div style="margin-bottom:18px;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6366f1;margin-bottom:8px;">Network Information</div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;background:#f8fafc;border-radius:8px;padding:8px;">
            <tbody>
              <tr>
                <td style="padding:6px 12px;color:#64748b;width:130px;font-weight:600;">ISP</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayIsp)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">Organization</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayOrganization)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">ASN</td>
                <td style="padding:6px 12px;color:#0f172a;"><code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;">${escapeHtml(displayAsn)}</code></td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;">AS Name</td>
                <td style="padding:6px 12px;color:#0f172a;">${escapeHtml(displayAsName)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Browser Section -->
        <div style="margin-bottom:20px;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:8px;">Browser &amp; Request</div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;background:#f8fafc;border-radius:8px;padding:8px;">
            <tbody>
              <tr>
                <td style="padding:6px 12px;color:#64748b;width:130px;font-weight:600;vertical-align:top;">Referrer</td>
                <td style="padding:6px 12px;color:#0f172a;word-break:break-all;">${escapeHtml(displayReferrer)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#64748b;font-weight:600;vertical-align:top;">User-Agent</td>
                <td style="padding:6px 12px;color:#334155;font-size:12px;word-break:break-word;font-family:monospace;">${escapeHtml(displayUserAgent)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="padding-top:16px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;text-align:center;">
          Automated notification from your portfolio backend (${escapeHtml(siteDomain)})
        </div>
      </div>
    `;

    // Recipient email
    const recipient =
      process.env.RESUME_NOTIFICATION_EMAIL ||
      process.env.SMTP_TO ||
      process.env.ADMIN_EMAIL ||
      process.env.SMTP_USER;

    if (!recipient) {
      console.warn("[RESUME NOTIFICATION] No recipient email configured (set RESUME_NOTIFICATION_EMAIL or SMTP_TO). Skipping email dispatch.");
      return { skipped: true, reason: "no_recipient" };
    }

    // Option 1: Resend API (if RESEND_API_KEY or EMAIL_API_KEY is configured)
    const resendApiKey =
      process.env.RESEND_API_KEY ||
      (process.env.EMAIL_API_KEY?.startsWith("re_") ? process.env.EMAIL_API_KEY : null);

    if (resendApiKey) {
      try {
        const fromEmail =
          process.env.RESEND_FROM ||
          process.env.SMTP_FROM ||
          "Portfolio <onboarding@resend.dev>";

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [recipient],
            subject,
            text,
            html,
          }),
        });

        if (res.ok) {
          console.log("[RESUME NOTIFICATION] Sent notification email via Resend to", recipient);
          return { success: true, provider: "resend" };
        }
        const errorData = await res.json().catch(() => ({}));
        console.warn("[RESUME NOTIFICATION] Resend API error:", errorData);
      } catch (resendErr) {
        console.warn("[RESUME NOTIFICATION] Resend request exception:", resendErr?.message || resendErr);
      }
    }

    // Option 2: Nodemailer SMTP
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from =
      process.env.SMTP_FROM ||
      (user ? `Portfolio <${user}>` : `Portfolio <no-reply@${siteDomain}>`);

    if (!host || !user || !pass) {
      console.warn("[RESUME NOTIFICATION] SMTP environment variables not configured. Skipping email dispatch.");
      return { skipped: true, reason: "smtp_not_configured" };
    }

    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: recipient,
      subject,
      text,
      html,
    });

    console.log("[RESUME NOTIFICATION] Sent notification email via SMTP to", recipient);
    return { success: true, provider: "smtp" };
  } catch (err) {
    console.error("[RESUME NOTIFICATION] Failed to send notification email:", err?.message || err);
    return { success: false, error: err?.message || err };
  }
}
