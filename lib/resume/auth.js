import crypto from "node:crypto";

const TICKET_TTL_SECONDS = 60;
const TICKET_TTL_MS = TICKET_TTL_SECONDS * 1000;
export const RESUME_AUTH_COOKIE = "resume_download_auth";

// In-memory fallback store: ticketId -> { ip, expiresAt }
const memoryTicketStore = new Map();

function cleanMemoryStore() {
  const now = Date.now();
  if (memoryTicketStore.size > 200) {
    for (const [key, record] of memoryTicketStore.entries()) {
      if (now > record.expiresAt) {
        memoryTicketStore.delete(key);
      }
    }
  }
}

async function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const { Redis } = await import("@upstash/redis");
    return new Redis({ url, token });
  } catch (err) {
    console.warn("[RESUME AUTH] Upstash Redis unavailable, using memory store:", err?.message || err);
    return null;
  }
}

/**
 * Creates a short-lived single-use authorization ticket for resume download.
 * Generates 256-bit cryptographically secure random ticket.
 *
 * @param {object} params
 * @param {string} params.ip
 * @returns {Promise<string>} The generated authorization ticket
 */
export async function createDownloadAuthorization({ ip }) {
  const ticketId = crypto.randomBytes(32).toString("hex");
  const normalizedIp = ip && ip !== "unknown" && ip !== "Not available" ? ip.trim() : "anonymous";
  const now = Date.now();
  const expiresAt = now + TICKET_TTL_MS;

  const redis = await getRedisClient();
  if (redis) {
    try {
      const payload = JSON.stringify({ ip: normalizedIp, createdAt: now });
      await redis.set(`resume_auth:${ticketId}`, payload, { ex: TICKET_TTL_SECONDS });
      return ticketId;
    } catch (err) {
      console.warn("[RESUME AUTH] Upstash ticket creation failed, saving to memory:", err?.message || err);
    }
  }

  cleanMemoryStore();
  memoryTicketStore.set(ticketId, { ip: normalizedIp, expiresAt });
  return ticketId;
}

/**
 * Validates and immediately consumes (invalidates) a download authorization ticket.
 * Single-use guarantee: Once consumed, the ticket is deleted immediately.
 * Uses atomic GETDEL in Redis to prevent concurrent race conditions.
 *
 * @param {object} params
 * @param {string} params.ticket
 * @param {string} [params.ip]
 * @returns {Promise<{ valid: boolean, reason?: string }>}
 */
export async function consumeDownloadAuthorization({ ticket, ip }) {
  if (!ticket || typeof ticket !== "string" || ticket.trim() === "" || ticket.length !== 64) {
    return { valid: false, reason: "invalid_or_malformed_ticket" };
  }

  const cleanTicket = ticket.trim();
  const normalizedIp = ip && ip !== "unknown" && ip !== "Not available" ? ip.trim() : null;

  const redis = await getRedisClient();
  if (redis) {
    try {
      const key = `resume_auth:${cleanTicket}`;
      // Atomic getdel operation
      let raw;
      if (typeof redis.getdel === "function") {
        raw = await redis.getdel(key);
      } else {
        // Fallback transaction / get & del
        raw = await redis.get(key);
        if (raw) await redis.del(key);
      }

      if (raw) {
        let data;
        try {
          data = typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          data = {};
        }

        // Validate IP binding if IP was recorded and caller IP is known
        if (
          normalizedIp &&
          data.ip &&
          data.ip !== "anonymous" &&
          data.ip !== normalizedIp
        ) {
          console.warn("[RESUME AUTH] IP mismatch for ticket:", { expected: data.ip, received: normalizedIp });
          return { valid: false, reason: "ip_mismatch" };
        }

        return { valid: true };
      }
    } catch (err) {
      console.warn("[RESUME AUTH] Upstash ticket consumption failed, checking memory:", err?.message || err);
    }
  }

  cleanMemoryStore();
  const record = memoryTicketStore.get(cleanTicket);
  if (!record) {
    return { valid: false, reason: "not_found_or_expired" };
  }

  // Delete immediately to enforce single-use
  memoryTicketStore.delete(cleanTicket);

  if (Date.now() > record.expiresAt) {
    return { valid: false, reason: "expired" };
  }

  if (
    normalizedIp &&
    record.ip &&
    record.ip !== "anonymous" &&
    record.ip !== normalizedIp
  ) {
    console.warn("[RESUME AUTH] IP mismatch in memory store:", { expected: record.ip, received: normalizedIp });
    return { valid: false, reason: "ip_mismatch" };
  }

  return { valid: true };
}

/**
 * Cookie options for setting the short-lived authorization cookie.
 * Ensures strict security attributes.
 */
export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: TICKET_TTL_SECONDS,
  };
}
