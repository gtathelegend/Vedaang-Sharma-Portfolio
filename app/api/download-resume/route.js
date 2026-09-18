import { createAdminClient } from "@/lib/supabase/admin";
import { extractDownloadMetadata, sendResumeNotification } from "@/lib/resume/notify";
import { fetchIpGeolocation } from "@/lib/resume/geolocation";
import { logResumeDownload, updateDownloadEmailStatus } from "@/lib/resume/logger";
import {
  consumeDownloadAuthorization,
  RESUME_AUTH_COOKIE,
  getAuthCookieOptions,
} from "@/lib/resume/auth";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const RESUME_FILENAME = "Vedaang_Sharma_Resume.pdf";

/**
 * Checks if the request is from an authenticated admin.
 * Used for admin test download without requiring public Turnstile.
 */
async function isAuthorizedAdmin() {
  try {
    const { requireAdmin } = await import("@/lib/auth/requireAdmin");
    const user = await requireAdmin();
    return Boolean(user);
  } catch {
    return false;
  }
}

/**
 * Extracts the authorization ticket from cookies or headers.
 */
function extractAuthTicket(request) {
  // 1. From NextRequest cookies if present
  if (typeof request.cookies?.get === "function") {
    const cookieVal = request.cookies.get(RESUME_AUTH_COOKIE)?.value;
    if (cookieVal) return cookieVal.trim();
  }

  // 2. From standard Cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${RESUME_AUTH_COOKIE}=([^;]+)`));
    if (match && match[1]) {
      return decodeURIComponent(match[1]).trim();
    }
  }

  // 3. From custom x-resume-auth header
  const customHeader = request.headers.get("x-resume-auth");
  if (customHeader) return customHeader.trim();

  // 4. From Authorization: Bearer <ticket>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

/**
 * Common handler for serving the resume securely, logging the download,
 * resolving geolocation, and sending email alerts.
 *
 * Security: Requires valid short-lived single-use authorization from /api/resume/authorize
 * (or active admin session) before serving the file or logging telemetry.
 *
 * Resilience guarantee: Geolocation, DB logging, and email dispatch are wrapped
 * in isolated error boundaries. Failures in telemetry or notifications will NEVER
 * block or disrupt the visitor's PDF download once authorized.
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function handleResumeDownload(request) {
  // 1. Security validation: Only allow GET and HEAD requests.
  // Never allow arbitrary file paths or query parameters to dictate files served.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // 2. Extract metadata server-side (IP, User-Agent, Referrer, URL, Timestamp)
  const metadata = extractDownloadMetadata(request, RESUME_FILENAME);

  // 3. Authorization verification: Check admin session or single-use Turnstile authorization ticket
  const isAdmin = await isAuthorizedAdmin();
  if (!isAdmin) {
    const ticket = extractAuthTicket(request);
    if (!ticket) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Download authorization required. Please verify you are human before downloading.",
        },
        { status: 403 }
      );
    }

    const authResult = await consumeDownloadAuthorization({
      ticket,
      ip: metadata.ip,
    });

    if (!authResult.valid) {
      console.warn("[RESUME DOWNLOAD] Invalid or expired authorization ticket:", {
        ip: metadata.ip,
        reason: authResult.reason,
      });
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Download authorization has expired or is invalid. Please verify again.",
          reason: authResult.reason,
        },
        { status: 403 }
      );
    }
  }

  // 4. Process telemetry (Geolocation, Database Logging, Email Notification)
  // Run asynchronously without throwing errors to guarantee PDF delivery.
  try {
    // 4a. Resolve IP Geolocation via IP-API
    const geo = await fetchIpGeolocation(metadata.ip);

    // 4b. Record download event in Supabase database
    const dbResult = await logResumeDownload({
      metadata,
      geo,
      emailStatus: "pending",
    });

    // 4c. Send notification email with download & geolocation details
    let finalEmailStatus = "skipped";
    try {
      const emailResult = await sendResumeNotification({ metadata, geo });
      if (emailResult?.success) {
        finalEmailStatus = "sent";
      } else if (emailResult?.skipped) {
        finalEmailStatus = emailResult.reason === "cooldown" ? "cooldown" : "skipped";
      } else {
        finalEmailStatus = "failed";
      }
    } catch (mailErr) {
      console.error("[RESUME DOWNLOAD] Email send caught exception:", mailErr?.message || mailErr);
      finalEmailStatus = "failed";
    }

    // 4d. Update database record with final email status if record was created
    if (dbResult?.recordId) {
      await updateDownloadEmailStatus(dbResult.recordId, finalEmailStatus);
    }
  } catch (telemetryErr) {
    // Never propagate telemetry errors to the download response
    console.error("[RESUME DOWNLOAD] Telemetry processing caught unexpected error:", telemetryErr?.message || telemetryErr);
  }

  // 5. Retrieve and serve the resume PDF to the visitor
  // Clear the auth cookie on response to guarantee single-use cleanup
  const clearCookieOpts = { ...getAuthCookieOptions(), maxAge: 0 };

  // Primary source: Supabase Storage bucket 'images' at 'resume/current.pdf'
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      const {
        data: { publicUrl },
      } = admin.storage.from("images").getPublicUrl("resume/current.pdf");

      if (publicUrl) {
        const res = await fetch(publicUrl, { cache: "no-store" });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const pdfResponse = new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
              "Cache-Control": "no-store, no-cache, must-revalidate",
              "Pragma": "no-cache",
            },
          });
          pdfResponse.cookies.set(RESUME_AUTH_COOKIE, "", clearCookieOpts);
          return pdfResponse;
        }
      }
    }
  } catch (storageErr) {
    console.warn(
      "[RESUME DOWNLOAD] Supabase Storage retrieval issue, checking local filesystem fallback:",
      storageErr?.message || storageErr
    );
  }

  // 6. Local filesystem fallback (if stored locally in public folder)
  const localCandidates = [
    path.join(process.cwd(), "public", "docs", "cv.pdf"),
    path.join(process.cwd(), "public", "docs", "Vedaang_Sharma_Resume.pdf"),
    path.join(process.cwd(), "public", "resume.pdf"),
  ];

  for (const candidatePath of localCandidates) {
    try {
      const buffer = await fs.readFile(candidatePath);
      const pdfResponse = new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
      pdfResponse.cookies.set(RESUME_AUTH_COOKIE, "", clearCookieOpts);
      return pdfResponse;
    } catch {
      // Continue to next candidate
    }
  }

  // 7. If no resume is found in storage or filesystem
  return new NextResponse(
    "Resume file currently unavailable. Please contact vedaangsharma2006@gmail.com.",
    { status: 404, headers: { "Content-Type": "text/plain" } }
  );
}

export async function GET(request) {
  return handleResumeDownload(request);
}

export async function HEAD(request) {
  return handleResumeDownload(request);
}
