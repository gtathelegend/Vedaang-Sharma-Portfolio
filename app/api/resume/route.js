import { handleResumeDownload } from "@/app/api/download-resume/route";

export const runtime = "nodejs";

export async function GET(request) {
  return handleResumeDownload(request);
}

export async function HEAD(request) {
  return handleResumeDownload(request);
}
