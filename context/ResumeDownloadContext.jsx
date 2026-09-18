"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ResumeDownloadModal from "@/components/ResumeDownloadModal";

const ResumeDownloadContext = createContext(null);

export function ResumeDownloadProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openResumeModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeResumeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ResumeDownloadContext.Provider value={{ isOpen, openResumeModal, closeResumeModal }}>
      {children}
      <ResumeDownloadModal isOpen={isOpen} onClose={closeResumeModal} />
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
