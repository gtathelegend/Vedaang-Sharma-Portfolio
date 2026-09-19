"use client";

import AskVedaang from "@/components/AskVedaang";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function AskPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition mb-4"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" /> Back to Home
        </Link>
        <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-400/10 border border-amber-200/60 dark:border-amber-400/20 px-3 py-1 rounded-full mb-3">
          Conversational Portfolio Agent
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-stone-900 dark:text-stone-100 mb-2">
          Chat with Vedaang
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
          Ask questions to explore engineering case studies, research papers, work experience, backend architecture, or tech stack details.
        </p>
      </div>

      <AskVedaang embedded />
    </main>
  );
}
