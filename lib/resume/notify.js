import nodemailer from "nodemailer";
import { getPostHogClient } from "@/lib/posthog-server";

// In-memory cooldown store to prevent email flooding from rapid repeated clicks.
// Key: IP address -> timestamp of last sent email (ms)
const memoryCooldownStore = new Map();
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes cooldown per IP

/**
 * Extracts client IP using Vercel/proxy headers without blindly trusting spoofed headers.
 * @param {Request} request
 * @returns {string}
 */
export function extractClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const firstIp = xff.split(",")[0].trim();
    if (firstIp && firstIp !== "unknown") return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp !== "unknown") return realIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && cfIp !== "unknown") return cfIp.trim();

  return "Not available";
}

/**
 * Checks if the IP is currently in the duplicate notification cooldown window.
 * Returns true if notification should be throttled (skipped).
 */
async function isNotificationOnCooldown(ip) {
  if (!ip || ip === "Not available") return false;

  // Check Upstash Redis if available for distributed serverless instances
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({ url: upstashUrl, token: upstashToken });
      const key = `cooldown:resume:${ip}`;
      // Set key with 120s TTL only if it doesn't exist (NX)
      const acquired = await redis.set(key, "1", { nx: true, ex: 120 });
      // If acquired is null, key already existed -> on cooldown
      return acquired === null;
    } catch (err) {
      console.warn("[RESUME NOTIFICATION] Upstash check failed, falling back to memory:", err?.message || err);
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
 * Extracts complete download metadata from request.
 */
export function extractDownloadMetadata(request, filename = "Vedaang_Sharma_Resume.pdf") {
  const ip = extractClientIp(request);
  const userAgent = request.headers.get("user-agent") || "Not available";
  const referer = request.headers.get("referer") || request.headers.get("referrer") || "Direct / Not available";
  
  let downloadUrl = "Not available";
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

/**
 * Sends the notification email asynchronously without blocking the caller.
 * Never throws — failures are logged to server console.
 */
export async function sendResumeNotification(metadata) {
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

    // Plain text content
    const text = [
      `A visitor has downloaded your resume from your portfolio website.`,
      ``,
      `Resume:`,
      filename,
      ``,
      `Time:`,
      `${timestampFormatted} (${timestampIso})`,
      ``,
      `IP Address:`,
      ip,
      ``,
      `User-Agent:`,
      userAgent,
      ``,
      `Referrer:`,
      referer,
      ``,
      `Download URL:`,
      downloadUrl,
    ].join("\n");

    // Professional HTML content
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;line-height:1.6;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
        <div style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:20px;">
          <h2 style="margin:0 0 6px;font-size:20px;color:#0f172a;font-weight:700;">Resume Downloaded</h2>
          <p style="margin:0;color:#64748b;font-size:14px;">A visitor has downloaded your resume from your portfolio website.</p>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tbody>
            <tr>
              <td style="padding:8px 0;color:#64748b;width:120px;vertical-align:top;font-weight:600;">Resume</td>
              <td style="padding:8px 0;color:#0f172a;font-weight:600;">${escapeHtml(filename)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b;vertical-align:top;font-weight:600;">Time</td>
              <td style="padding:8px 0;color:#0f172a;">
                <div><strong>${escapeHtml(timestampFormatted)}</strong></div>
                <div style="color:#64748b;font-size:12px;font-family:monospace;margin-top:2px;">${escapeHtml(timestampIso)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b;vertical-align:top;font-weight:600;">IP Address</td>
              <td style="padding:8px 0;color:#0f172a;">
                <code style="background:#f1f5f9;padding:3px 6px;border-radius:4px;font-family:monospace;font-size:13px;">${escapeHtml(ip)}</code>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b;vertical-align:top;font-weight:600;">Referrer</td>
              <td style="padding:8px 0;color:#0f172a;word-break:break-all;">${escapeHtml(referer)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b;vertical-align:top;font-weight:600;">Download URL</td>
              <td style="padding:8px 0;color:#0f172a;word-break:break-all;"><code style="background:#f1f5f9;padding:3px 6px;border-radius:4px;font-family:monospace;font-size:13px;">${escapeHtml(downloadUrl)}</code></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b;vertical-align:top;font-weight:600;">User-Agent</td>
              <td style="padding:8px 0;color:#334155;font-size:13px;word-break:break-word;background:#f8fafc;padding:8px;border-radius:6px;font-family:monospace;">${escapeHtml(userAgent)}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;text-align:center;">
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
      console.warn("[RESUME NOTIFICATION] No destination email configured (set RESUME_NOTIFICATION_EMAIL or SMTP_TO). Skipping email dispatch.");
      return { skipped: true, reason: "no_recipient" };
    }

    // Option 1: Resend API (if RESEND_API_KEY or EMAIL_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY || (process.env.EMAIL_API_KEY?.startsWith("re_") ? process.env.EMAIL_API_KEY : null);
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM || process.env.SMTP_FROM || "Portfolio <onboarding@resend.dev>";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
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
    const from = process.env.SMTP_FROM || (user ? `Portfolio <${user}>` : `Portfolio <no-reply@${siteDomain}>`);

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
    // Log server-side only; never throw so download flow is never broken
    console.error("[RESUME NOTIFICATION] Failed to send notification email:", err?.message || err);
    return { success: false, error: err?.message || err };
  }
}
