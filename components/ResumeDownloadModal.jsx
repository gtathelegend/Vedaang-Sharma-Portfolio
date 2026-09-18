"use client";

import { useEffect } from "react";
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

export default function ResumeDownloadModal({
  isOpen,
  status = "idle",
  errorMessage = "",
  isInteractiveRequired = false,
  onClose,
  onRetry,
}) {
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

  const isLoading = status === "authorizing" || status === "downloading";

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
            onClick={!isLoading ? onClose : undefined}
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
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Close dialog"
            >
              <FontAwesomeIcon icon={faXmark} className="text-base" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
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
                {isInteractiveRequired
                  ? "Please complete the quick verification below to start your download."
                  : "Preparing your verified download of Vedaang_Sharma_Resume.pdf…"}
              </p>

              {/* Progress & Status Feedback */}
              <div className="flex flex-col items-center justify-center py-2 min-h-[60px]">
                {isLoading && (
                  <div className="flex items-center gap-2.5 text-sm text-violet-600 dark:text-violet-400 font-medium py-3">
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-lg" />
                    <span>
                      {status === "authorizing" ? "Verifying authorization…" : "Preparing your PDF download…"}
                    </span>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold py-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-lg" />
                    <span>Verified! Download started.</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="w-full rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3.5 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-sm shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{errorMessage || "Verification error. Please retry."}</p>
                      {onRetry && (
                        <button
                          type="button"
                          onClick={onRetry}
                          className="mt-2 inline-flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-300 hover:underline cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
                          Retry verification
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
              <span>Protected by Cloudflare</span>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition cursor-pointer"
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
