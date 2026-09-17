/**
 * Lightweight client-side PostHog helper.
 * Defers loading posthog-js until an event is actually fired or until posthog initializes on idle,
 * keeping the initial critical bundle lightweight and avoiding blocking scripts.
 */

function isAuditOrBot() {
  if (typeof navigator === "undefined") return true;
  return (
    /bot|crawler|spider|crawling|lighthouse|headlesschrome/i.test(navigator.userAgent) ||
    (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
  );
}

export function captureClientEvent(eventName, properties = {}) {
  if (typeof window === "undefined" || isAuditOrBot()) return;

  if (window.posthog && typeof window.posthog.capture === "function") {
    try {
      window.posthog.capture(eventName, properties);
    } catch {}
    return;
  }

  // Fallback: dynamic import if posthog hasn't finished idle initialization yet
  import("posthog-js")
    .then(({ default: posthog }) => {
      try {
        posthog.capture(eventName, properties);
      } catch {}
    })
    .catch(() => {});
}

export function captureClientException(error, additionalProperties = {}) {
  if (typeof window === "undefined" || isAuditOrBot()) return;

  if (window.posthog && typeof window.posthog.captureException === "function") {
    try {
      window.posthog.captureException(error, additionalProperties);
    } catch {}
    return;
  }

  import("posthog-js")
    .then(({ default: posthog }) => {
      try {
        posthog.captureException(error, additionalProperties);
      } catch {}
    })
    .catch(() => {});
}
