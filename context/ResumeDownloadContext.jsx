"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";
import Turnstile from "@/components/Turnstile";
import ResumeDownloadModal from "@/components/ResumeDownloadModal";
import { captureClientEvent } from "@/lib/posthog-client";

const ResumeDownloadContext = createContext(null);

export function ResumeDownloadProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle"); // 'idle' | 'authorizing' | 'downloading' | 'success' | 'error'
  const [modalError, setModalError] = useState("");
  const [isInteractiveRequired, setIsInteractiveRequired] = useState(false);

  const backgroundTokenRef = useRef("");
  const isAuthorizingRef = useRef(false);
  const turnstileRef = useRef(null);

  // Background Turnstile callbacks
  const handleTurnstileSuccess = useCallback((token) => {
    backgroundTokenRef.current = token;
    setModalError("");

    // If modal is open and waiting for verification, proceed with download
    if (isModalOpen && modalStatus !== "authorizing" && modalStatus !== "downloading" && modalStatus !== "success") {
      executeDownloadFlow(token);
    }
  }, [isModalOpen, modalStatus]);

  const handleTurnstileError = useCallback(() => {
    backgroundTokenRef.current = "";
    if (isModalOpen) {
      setModalStatus("error");
      setModalError("Cloudflare verification encountered an issue. Please retry.");
    }
  }, [isModalOpen]);

  const handleTurnstileExpire = useCallback(() => {
    backgroundTokenRef.current = "";
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
    if (isModalOpen) {
      setModalStatus("error");
      setModalError("Verification challenge expired. Please verify again.");
    }
  }, [isModalOpen]);

  const handleBeforeInteractive = useCallback(() => {
    setIsInteractiveRequired(true);
    // If interactive challenge is required by Cloudflare, open modal so visitor can click
    setIsModalOpen(true);
  }, []);

  const executeDownloadFlow = async (token) => {
    if (isAuthorizingRef.current) return;
    isAuthorizingRef.current = true;

    setModalStatus("authorizing");
    setModalError("");

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

      setModalStatus("downloading");

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
        captureClientEvent("cv_downloaded", { source: "turnstile_verified" });
      } catch {}

      setModalStatus("success");

      // Clear used token and silently request a fresh one in background for future downloads
      backgroundTokenRef.current = "";
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setModalStatus("idle");
      }, 1000);
    } catch (err) {
      console.error("[RESUME DOWNLOAD] Flow error:", err);
      setModalStatus("error");
      setModalError(err.message || "Verification or download error. Please try again.");
      backgroundTokenRef.current = "";
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    } finally {
      isAuthorizingRef.current = false;
    }
  };

  const openResumeModal = useCallback(() => {
    // If a background token is already validated and ready, download directly without friction
    const currentToken = backgroundTokenRef.current;
    if (currentToken && !isAuthorizingRef.current) {
      executeDownloadFlow(currentToken);
      return;
    }

    // Otherwise, open the modal and show progress / interactive challenge
    setIsModalOpen(true);
    setModalStatus("idle");
    setModalError("");
  }, []);

  const closeResumeModal = useCallback(() => {
    if (modalStatus !== "authorizing" && modalStatus !== "downloading") {
      setIsModalOpen(false);
      setModalStatus("idle");
      setModalError("");
    }
  }, [modalStatus]);

  const handleRetry = useCallback(() => {
    setModalStatus("idle");
    setModalError("");
    backgroundTokenRef.current = "";
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  }, []);

  return (
    <ResumeDownloadContext.Provider value={{ isModalOpen, openResumeModal, closeResumeModal }}>
      {children}

      {/* Persistent Background Turnstile Widget */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0" aria-hidden="true">
        <Turnstile
          ref={turnstileRef}
          action="resume_download"
          appearance="interaction-only"
          execution="render"
          onSuccess={handleTurnstileSuccess}
          onError={handleTurnstileError}
          onExpire={handleTurnstileExpire}
          onBeforeInteractive={handleBeforeInteractive}
        />
      </div>

      {/* Interactive Modal (displayed when interaction is needed or when loading/retrying) */}
      <ResumeDownloadModal
        isOpen={isModalOpen}
        status={modalStatus}
        errorMessage={modalError}
        isInteractiveRequired={isInteractiveRequired}
        onClose={closeResumeModal}
        onRetry={handleRetry}
      />
    </ResumeDownloadContext.Provider>
  );
}

export function useResumeDownload() {
  const ctx = useContext(ResumeDownloadContext);
  if (!ctx) {
    throw new Error("useResumeDownload must be used within a ResumeDownloadProvider");
  }
  return ctx;
}
