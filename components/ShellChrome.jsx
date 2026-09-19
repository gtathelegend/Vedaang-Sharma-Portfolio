"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});
const TerminalIntro = dynamic(() => import("@/components/TerminalIntro"), {
  ssr: false,
});
const AskVedaang = dynamic(() => import("@/components/AskVedaang"), {
  ssr: false,
});

export default function ShellChrome() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [introReady, setIntroReady] = useState(false);

  if (isAdminRoute) {
    return <ThemeProvider />;
  }

  return (
    <>
      <ThemeProvider />
      <TerminalIntro onDone={() => setIntroReady(true)} />
      <Navbar introReady={introReady} />
      <CommandPalette introReady={introReady} />
      <AskVedaang />
    </>
  );
}
