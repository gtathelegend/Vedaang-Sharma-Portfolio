"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faXmark,
  faCircleNotch,
  faCircleCheck,
  faCircleExclamation,
  faRotateRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import Turnstile from "@/components/Turnstile";
import { captureClientEvent } from "@/lib/posthog-client";

export default function ResumeDownloadModal({ isOpen, onClose }) {
  const [status, setStatus] = useState("idle"); // 'idle' | 'authorizing' | 'downloading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef(null);
  const isMountedRef = useRef(true);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && status !== "authorizing" && status !== "downloading") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, onClose]);

  const handleTurnstileSuccess = useCallback(async (token) => {
    if (status === "authorizing" || status === "downloading") return;

    setStatus("authorizing");
    setErrorMessage("");

    try {
      // 1. Authorize download via server Turnstile verification
      const authRes = await fetch("/api/resume/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turnstileToken: token }),
      });

      const authData = await authRes.json().catch(() => ({}));

      if (!authRes.ok) {
        throw new Error(authData.message || "Bot verification failed. Please try again.");
      }

      setStatus("downloading");

      // 2. Fetch the protected resume PDF using the short-lived HttpOnly authorization cookie
      const pdfRes = await fetch("/api/download-resume", {
        method: "GET",
      });

      if (!pdfRes.ok) {
        const errorText = await pdfRes.text().catch(() => "");
        let errorMsg = "Could not retrieve resume. Please try again.";
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.message) errorMsg = parsed.message;
        } catch {}
        throw new Error(errorMsg);
      }

      // 3. Trigger browser file download from binary blob
      const blob = await pdfRes.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "Vedaang_Sharma_Resume.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);

      // 4. Record analytics
      try {
        captureClientEvent("cv_downloaded", { source: "turnstile_modal" });
      } catch {}

      setStatus("success");

      // Auto close after success
      setTimeout(() => {
        if (isMountedRef.current) {
          onClose();
        }
      }, 1400);
    } catch (err) {
      console.error("[RESUME MODAL] Download flow error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Verification or download error. Please try again.");
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    }
  }, [status, onClose]);

  const handleTurnstileError = useCallback((errorCode) => {
    setStatus("error");
    setErrorMessage("Cloudflare verification encountered an issue. Please retry.");
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setStatus("error");
    setErrorMessage("Verification challenge expired. Please verify again.");
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  }, []);

  const handleRetry = () => {
    setStatus("idle");
    setErrorMessage("");
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={status !== "authorizing" && status !== "downloading" ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden p-6 sm:p-7 z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={status === "authorizing" || status === "downloading"}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Close dialog"
            >
              <FontAwesomeIcon icon={faXmark} className="text-base" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400">
                <FontAwesomeIcon icon={faFilePdf} className="text-xl" />
              </div>
              <div>
                <h3 id="resume-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
                  Download Resume
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-[11px] text-emerald-500" />
                  Bot verification protected
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Please complete the quick verification below. Your download of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">Vedaang_Sharma_Resume.pdf</span> will begin automatically.
              </p>

              {/* Turnstile Container */}
              <div className="flex flex-col items-center justify-center py-2 min-h-[75px]">
                {status !== "success" && (
                  <Turnstile
                    ref={turnstileRef}
                    action="resume_download"
                    onSuccess={handleTurnstileSuccess}
                    onError={handleTurnstileError}
                    onExpire={handleTurnstileExpire}
                  />
                )}

                {/* Progress / Status feedback */}
                {(status === "authorizing" || status === "downloading") && (
                  <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium py-2">
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-base" />
                    <span>
                      {status === "authorizing" ? "Verifying response…" : "Preparing your PDF download…"}
                    </span>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold py-4">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-lg" />
                    <span>Verified! Your download has started.</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="w-full rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3.5 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5 mt-2">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-sm shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{errorMessage}</p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-2 inline-flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-300 hover:underline"
                      >
                        <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
                        Retry verification
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
              <span>Protected by Cloudflare</span>
              <button
                type="button"
                onClick={onClose}
                disabled={status === "authorizing" || status === "downloading"}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
