import { NextResponse } from "next/server";
import { extractClientIp } from "@/lib/resume/notify";
import { rateLimit } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { createDownloadAuthorization, RESUME_AUTH_COOKIE, getAuthCookieOptions } from "@/lib/resume/auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const ip = extractClientIp(request);

    // 1. Rate limiting: 10 authorization requests per 10 minutes per IP
    const { success: rateLimitSuccess, reset } = await rateLimit(`resume_auth:${ip}`, {
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimitSuccess) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      console.warn("[RESUME AUTHORIZE] Rate limit exceeded for IP:", { ip, retryAfter });
      return NextResponse.json(
        { message: "Too many requests. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
    }

    const token = body?.turnstileToken || body?.token;
    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required." },
        { status: 400 }
      );
    }

    // 3. Verify Turnstile token server-side
    const verification = await verifyTurnstileToken({ token, ip });
    if (!verification.success) {
      console.warn("[RESUME AUTHORIZE] Turnstile validation failed:", { ip, errorCodes: verification.errorCodes });
      return NextResponse.json(
        {
          message: "Verification failed or expired. Please try again.",
          errorCodes: verification.errorCodes,
        },
        { status: 403 }
      );
    }

    // 4. Create short-lived, single-use download authorization ticket
    const ticket = await createDownloadAuthorization({ ip });

    // 5. Respond with success status and set secure HttpOnly cookie
    const response = NextResponse.json(
      { ok: true, message: "Authorization granted." },
      { status: 200 }
    );

    const cookieOpts = getAuthCookieOptions();
    response.cookies.set(RESUME_AUTH_COOKIE, ticket, cookieOpts);

    return response;
  } catch (err) {
    console.error("[RESUME AUTHORIZE] Unexpected error:", err?.message || err);
    return NextResponse.json(
      { message: "Internal server error during authorization." },
      { status: 500 }
    );
  }
}
