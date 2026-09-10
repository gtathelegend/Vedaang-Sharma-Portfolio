import { createAdminClient } from "@/lib/supabase/admin";
import { extractDownloadMetadata, sendResumeNotification } from "@/lib/resume/notify";
import { fetchIpGeolocation } from "@/lib/resume/geolocation";
import { logResumeDownload, updateDownloadEmailStatus } from "@/lib/resume/logger";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const RESUME_FILENAME = "Vedaang_Sharma_Resume.pdf";

/**
 * Common handler for serving the resume securely, logging the download,
 * resolving geolocation, and sending email alerts.
 *
 * Resilience guarantee: Geolocation, DB logging, and email dispatch are wrapped
 * in isolated error boundaries. Failures in telemetry or notifications will NEVER
 * block or disrupt the visitor's PDF download.
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

  // 3. Process telemetry (Geolocation, Database Logging, Email Notification)
  // Run asynchronously without throwing errors to guarantee PDF delivery.
  try {
    // 3a. Resolve IP Geolocation via IP-API
    const geo = await fetchIpGeolocation(metadata.ip);

    // 3b. Record download event in Supabase database
    const dbResult = await logResumeDownload({
      metadata,
      geo,
      emailStatus: "pending",
    });

    // 3c. Send notification email with download & geolocation details
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

    // 3d. Update database record with final email status if record was created
    if (dbResult?.recordId) {
      await updateDownloadEmailStatus(dbResult.recordId, finalEmailStatus);
    }
  } catch (telemetryErr) {
    // Never propagate telemetry errors to the download response
    console.error("[RESUME DOWNLOAD] Telemetry processing caught unexpected error:", telemetryErr?.message || telemetryErr);
  }

  // 4. Retrieve and serve the resume PDF to the visitor
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
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
              "Cache-Control": "no-store, no-cache, must-revalidate",
              "Pragma": "no-cache",
            },
          });
        }
      }
    }
  } catch (storageErr) {
    console.warn(
      "[RESUME DOWNLOAD] Supabase Storage retrieval issue, checking local filesystem fallback:",
      storageErr?.message || storageErr
    );
  }

  // 5. Local filesystem fallback (if stored locally in public folder)
  const localCandidates = [
    path.join(process.cwd(), "public", "docs", "cv.pdf"),
    path.join(process.cwd(), "public", "docs", "Vedaang_Sharma_Resume.pdf"),
    path.join(process.cwd(), "public", "resume.pdf"),
  ];

  for (const candidatePath of localCandidates) {
    try {
      const buffer = await fs.readFile(candidatePath);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    } catch {
      // Continue to next candidate
    }
  }

  // 6. If no resume is found in storage or filesystem
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
