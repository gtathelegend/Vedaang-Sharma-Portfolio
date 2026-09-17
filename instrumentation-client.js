if (typeof window !== "undefined") {
  const isAuditOrBot =
    /bot|crawler|spider|crawling|lighthouse|headlesschrome/i.test(navigator.userAgent) ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (!isAuditOrBot && process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    const init = () => {
      import("posthog-js")
        .then(({ default: posthog }) => {
          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
            api_host: "/ingest",
            ui_host: "https://us.posthog.com",
            defaults: "2026-01-30",
            autocapture: false,
            capture_performance: false,
            disable_session_recording: true,
            disable_surveys: true,
            capture_exceptions: true,
            debug: process.env.NODE_ENV === "development",
          });
          window.posthog = posthog;
        })
        .catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(init, { timeout: 3000 });
    } else {
      setTimeout(init, 1500);
    }
  }
}
