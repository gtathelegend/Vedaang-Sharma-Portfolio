import { createAdminClient } from "@/lib/supabase/admin";
import { extractDownloadMetadata, sendResumeNotification } from "@/lib/resume/notify";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const RESUME_FILENAME = "Vedaang_Sharma_Resume.pdf";

/**
 * Common handler for serving the resume and dispatching the notification email.
 */
export async function handleResumeDownload(request) {
  // 1. Extract metadata server-side (IP, User-Agent, Referrer, URL, Timestamp)
  const metadata = extractDownloadMetadata(request, RESUME_FILENAME);

  // 2. Dispatch notification email asynchronously.
  // Never blocks or fails the download if email delivery fails.
  try {
    await sendResumeNotification(metadata);
  } catch (notifyErr) {
    console.error("[RESUME DOWNLOAD] Notification dispatch caught unexpected error:", notifyErr);
  }

  // 3. Attempt to retrieve the resume from Supabase Storage
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      const { data: { publicUrl } } = admin.storage
        .from("images")
        .getPublicUrl("resume/current.pdf");

      if (publicUrl) {
        const res = await fetch(publicUrl, { cache: "no-store" });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
              "Cache-Control": "no-store",
            },
          });
        }
      }
    }
  } catch (storageErr) {
    console.warn("[RESUME DOWNLOAD] Failed to retrieve from Supabase Storage, checking local fallback:", storageErr?.message || storageErr);
  }

  // 4. Local filesystem fallback (if stored locally in public folder)
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
          "Cache-Control": "no-store",
        },
      });
    } catch {
      // Continue to next candidate
    }
  }

  // 5. If no resume is found in storage or filesystem
  return new NextResponse(
    "No resume found. Please upload one from Admin → Settings → CV / Resume.",
    { status: 404, headers: { "Content-Type": "text/plain" } }
  );
}

export async function GET(request) {
  return handleResumeDownload(request);
}

export async function HEAD(request) {
  return handleResumeDownload(request);
}
