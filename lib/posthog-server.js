import { PostHog } from "posthog-node";

let posthogClient = null;

export function getPostHogClient() {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return null;

  if (!posthogClient) {
    try {
      posthogClient = new PostHog(token, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        flushAt: 1,
        flushInterval: 0,
      });
    } catch (err) {
      console.warn("[posthog-server] Failed to initialize PostHog client:", err?.message || err);
      return null;
    }
  }
  return posthogClient;
}
