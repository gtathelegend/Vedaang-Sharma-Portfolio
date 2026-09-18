"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useState } from "react";

// Official Cloudflare dummy test site keys:
// 1x00000000000000000000AA -> Always passes (Visible)
// 2x00000000000000000000AB -> Always blocks
// 3x00000000000000000000FF -> Forces an interactive challenge
const CLOUDFLARE_TEST_SITE_KEY_PASS = "1x00000000000000000000AA";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise = null;

export function loadTurnstileScript() {
  if (typeof window === "undefined") return Promise.resolve(null);
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
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = (err) => {
      console.error("[TURNSTILE] Failed to load Turnstile script:", err);
      scriptPromise = null;
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
    appearance = "interaction-only",
    execution = "render",
    retry = "auto",
    retryInterval = 8000,
    onSuccess,
    onError,
    onExpire,
    onBeforeInteractive,
    onAfterInteractive,
    className = "",
  },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const isMountedRef = useRef(true);
  const [activeSiteKey, setActiveSiteKey] = useState(
    siteKey ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV !== "production" ? CLOUDFLARE_TEST_SITE_KEY_PASS : "")
  );

  // Keep callbacks in stable refs so that function identity changes in parent components
  // NEVER cause the Turnstile widget to be unmounted or recreated!
  const callbacksRef = useRef({
    onSuccess,
    onError,
    onExpire,
    onBeforeInteractive,
    onAfterInteractive,
  });

  useEffect(() => {
    callbacksRef.current = {
      onSuccess,
      onError,
      onExpire,
      onBeforeInteractive,
      onAfterInteractive,
    };
  });

  const reset = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (err) {
        console.warn("[TURNSTILE] Reset error:", err);
      }
    }
  }, []);

  const execute = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.execute(containerRef.current, {
          action,
          cdata: cData,
        });
      } catch (err) {
        console.warn("[TURNSTILE] Execute error:", err);
      }
    }
  }, [action, cData]);

  const getResponse = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        return window.turnstile.getResponse(widgetIdRef.current);
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  useImperativeHandle(ref, () => ({
    reset,
    execute,
    getResponse,
  }), [reset, execute, getResponse]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!activeSiteKey) {
      console.error("[TURNSTILE] Missing site key for Turnstile widget.");
      return;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled || !isMountedRef.current || !containerRef.current || !turnstile) return;

        // Clean up previous widget if siteKey changed
        if (widgetIdRef.current) {
          try {
            turnstile.remove(widgetIdRef.current);
          } catch {}
          widgetIdRef.current = null;
        }

        try {
          const id = turnstile.render(containerRef.current, {
            sitekey: activeSiteKey,
            action,
            cdata: cData,
            theme,
            size,
            appearance,
            execution,
            retry,
            "retry-interval": retryInterval,
            callback: (token) => {
              if (isMountedRef.current && callbacksRef.current.onSuccess) {
                callbacksRef.current.onSuccess(token);
              }
            },
            "error-callback": (errorCode) => {
              console.warn("[TURNSTILE] Challenge error:", errorCode);

              // In development, if a domain mismatch error occurs (110200), automatically fallback to universal test key
              if (
                process.env.NODE_ENV !== "production" &&
                (errorCode === "110200" || String(errorCode).includes("110200")) &&
                activeSiteKey !== CLOUDFLARE_TEST_SITE_KEY_PASS
              ) {
                console.info("[TURNSTILE] Domain mismatch in development. Falling back to universal test key.");
                setActiveSiteKey(CLOUDFLARE_TEST_SITE_KEY_PASS);
                return;
              }

              if (isMountedRef.current && callbacksRef.current.onError) {
                callbacksRef.current.onError(errorCode);
              }
            },
            "expired-callback": () => {
              console.warn("[TURNSTILE] Token expired.");
              if (isMountedRef.current && callbacksRef.current.onExpire) {
                callbacksRef.current.onExpire();
              }
            },
            "before-interactive-callback": () => {
              if (isMountedRef.current && callbacksRef.current.onBeforeInteractive) {
                callbacksRef.current.onBeforeInteractive();
              }
            },
            "after-interactive-callback": () => {
              if (isMountedRef.current && callbacksRef.current.onAfterInteractive) {
                callbacksRef.current.onAfterInteractive();
              }
            },
          });
          widgetIdRef.current = id;
        } catch (renderErr) {
          console.error("[TURNSTILE] Render exception:", renderErr);
        }
      })
      .catch((err) => {
        if (!cancelled && isMountedRef.current && callbacksRef.current.onError) {
          callbacksRef.current.onError("script-load-failed");
        }
      });

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [activeSiteKey, action, cData, theme, size, appearance, execution, retry, retryInterval]);

  return (
    <div
      ref={containerRef}
      className={`inline-block ${className}`}
      style={{ minHeight: appearance === "interaction-only" ? 0 : 65 }}
    />
  );
});

export default Turnstile;
