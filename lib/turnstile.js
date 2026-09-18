/**
 * Cloudflare Turnstile Server-Side Verification Utility
 * Reference: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5000;

// Official Cloudflare dummy test secret keys:
// 1x0000000000000000000000000000000AA -> Always passes
// 2x0000000000000000000000000000000AA -> Always fails
// 3x0000000000000000000000000000000AA -> Token already spent
const CLOUDFLARE_TEST_SECRET_KEY_PASS = "1x0000000000000000000000000000000AA";

/**
 * Validates a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * @param {object} params
 * @param {string} params.token - The Turnstile response token from the client.
 * @param {string} [params.ip] - Optional client IP address.
 * @param {string} [params.idempotencyKey] - Optional UUID for idempotency.
 * @returns {Promise<{ success: boolean, errorCodes: string[], hostname?: string, challengeTs?: string }>}
 */
export async function verifyTurnstileToken({ token, ip, idempotencyKey }) {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return {
      success: false,
      errorCodes: ["missing-input-response"],
    };
  }

  let secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[TURNSTILE] Missing CLOUDFLARE_TURNSTILE_SECRET_KEY in production environment.");
      return {
        success: false,
        errorCodes: ["missing-secret-key"],
      };
    }

    // In development/test, fallback to official Cloudflare always-pass test key if unset
    console.warn(
      "[TURNSTILE] CLOUDFLARE_TURNSTILE_SECRET_KEY unset in development. Using Cloudflare dummy pass test key."
    );
    secretKey = CLOUDFLARE_TEST_SECRET_KEY_PASS;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (ip && ip !== "unknown" && ip !== "Not available") {
      formData.append("remoteip", ip);
    }
    if (idempotencyKey) {
      formData.append("idempotency_key", idempotencyKey);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[TURNSTILE] HTTP ${response.status} from Cloudflare siteverify endpoint.`);
      return {
        success: false,
        errorCodes: [`http-error-${response.status}`],
      };
    }

    const data = await response.json();

    return {
      success: Boolean(data.success),
      errorCodes: Array.isArray(data["error-codes"]) ? data["error-codes"] : [],
      hostname: data.hostname,
      challengeTs: data.challenge_ts,
    };
  } catch (err) {
    console.error("[TURNSTILE] Verification request caught exception:", err?.message || err);
    return {
      success: false,
      errorCodes: [err?.name === "TimeoutError" ? "timeout" : "internal-error"],
    };
  }
}
