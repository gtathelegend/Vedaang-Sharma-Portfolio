"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

// Official Cloudflare dummy test site keys:
// 1x00000000000000000000AA -> Always passes (Visible)
// 2x00000000000000000000AB -> Always blocks
// 3x00000000000000000000FF -> Forces an interactive challenge
const CLOUDFLARE_TEST_SITE_KEY_PASS = "1x00000000000000000000AA";

let scriptPromise = null;

function loadTurnstileScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    // Check if script tag is already in DOM
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }
      existingScript.addEventListener("load", () => resolve(window.turnstile));
      existingScript.addEventListener("error", (err) => reject(err));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = (err) => {
      console.error("[TURNSTILE] Failed to load Turnstile script:", err);
      reject(err);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

const Turnstile = forwardRef(function Turnstile(
  {
    siteKey,
    action,
    cData,
    theme = "auto",
    size = "normal",
    onSuccess,
    onError,
    onExpire,
    className = "",
  },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const isMountedRef = useRef(true);

  const effectiveSiteKey =
    siteKey ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV !== "production" ? CLOUDFLARE_TEST_SITE_KEY_PASS : "");

  const reset = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (err) {
        console.warn("[TURNSTILE] Reset error:", err);
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    reset,
  }));

  useEffect(() => {
    isMountedRef.current = true;

    if (!effectiveSiteKey) {
      console.error("[TURNSTILE] Missing site key for Turnstile widget.");
      return;
    }

    loadTurnstileScript()
      .then((turnstile) => {
        if (!isMountedRef.current || !containerRef.current || !turnstile) return;

        // Clear container before rendering
        containerRef.current.innerHTML = "";

        try {
          const id = turnstile.render(containerRef.current, {
            sitekey: effectiveSiteKey,
            action,
            cdata: cData,
            theme,
            size,
            callback: (token) => {
              if (isMountedRef.current && onSuccess) {
                onSuccess(token);
              }
            },
            "error-callback": (errorCode) => {
              console.warn("[TURNSTILE] Challenge error:", errorCode);
              if (isMountedRef.current && onError) {
                onError(errorCode);
              }
            },
            "expired-callback": () => {
              console.warn("[TURNSTILE] Token expired.");
              if (isMountedRef.current && onExpire) {
                onExpire();
              }
            },
          });
          widgetIdRef.current = id;
        } catch (renderErr) {
          console.error("[TURNSTILE] Render exception:", renderErr);
        }
      })
      .catch((err) => {
        if (isMountedRef.current && onError) {
          onError("script-load-failed");
        }
      });

    return () => {
      isMountedRef.current = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [effectiveSiteKey, action, cData, theme, size, onSuccess, onError, onExpire]);

  return <div ref={containerRef} className={`inline-block min-h-[65px] ${className}`} />;
});

export default Turnstile;
