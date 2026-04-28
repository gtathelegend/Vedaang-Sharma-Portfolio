"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import ThemeProvider from "@/components/ThemeProvider";

export default function ShellChrome() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <ThemeProvider />;
  }

  return (
    <>
      <ThemeProvider />
      <Navbar />
      <CommandPalette />
    </>
  );
}
