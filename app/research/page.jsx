"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faArrowUpRightFromSquare,
  faBookOpen,
  faMicroscope,
  faLightbulb,
  faCode,
  faBrain,
  faFlask,
  faGlobe,
  faCogs,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

const ICON_MAP = {
  faMicroscope,
  faLightbulb,
  faCode,
  faBrain,
  faFlask,
  faGlobe,
  faCogs,
  faRobot,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18, delay },
  }),
};

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 dark:text-gray-500 mb-3">
      {children}
    </p>
  );
}

export default function ResearchPage() {
  const [papers, setPapers]       = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetchJson("/api/research/papers"),
      fetchJson("/api/research/interests"),
    ]).then(([papersRes, interestsRes]) => {
      setPapers(papersRes.data || []);
      setInterests(interestsRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const featuredPaper = papers[0] || null;
  const otherPapers   = papers.slice(1);

  return (
    <main className="overflow-hidden bg-transparent min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[60svh] flex items-center overflow-hidden pt-24 pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-blue-50 dark:bg-blue-500/10 blur-3xl opacity-60" />
          <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-gray-100 dark:bg-white/5 blur-3xl opacity-50" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-8"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
          </Link>
          <motion.p
            className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 dark:text-gray-500 mb-3"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.05 }}
          >
            Research &amp; Publications
          </motion.p>
          <motion.h1
            className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.15 }}
          >
            Where engineering<br className="hidden sm:block" /> meets inquiry.
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.25 }}
          >
            Peer-reviewed work at the intersection of computer vision, AI systems, and human health.
            I believe research should have real-world impact — not just academic citations.
          </motion.p>
        </div>
      </section>

      {/* ── Featured Paper ── */}
      {!loading && featuredPaper && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <SectionLabel>Featured Publication</SectionLabel>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-gray-100 dark:border-white/10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/60 p-8 sm:p-10 md:p-14 shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.08)] dark:shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.5)]"
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-full">
                  <FontAwesomeIcon icon={faBookOpen} className="text-[10px]" /> Published{featuredPaper.year ? ` · ${featuredPaper.year}` : ""}
                </span>
                {featuredPaper.venue && (
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
                    {featuredPaper.venue}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-6">
                {featuredPaper.title}
              </h2>

              {featuredPaper.abstract && (
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8 max-w-3xl">
                  {featuredPaper.abstract}
                </p>
              )}

              {featuredPaper.areas?.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Research Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredPaper.areas.map((area) => (
                      <span
                        key={area}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {featuredPaper.projectSlug && (
                  <Link
                    href={`/research/${featuredPaper.projectSlug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-sm"
                  >
                    View Research <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                )}
                {featuredPaper.doiUrl && (
                  <a
                    href={featuredPaper.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    Read Paper <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  Discuss Research <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── More Papers ── */}
      {!loading && otherPapers.length > 0 && (
        <section className="pb-8 md:pb-12">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <SectionLabel>More Publications</SectionLabel>
            </motion.div>
            <div className="space-y-4">
              {otherPapers.map((paper, i) => (
                <motion.div
                  key={paper.id}
                  variants={fadeUp}
                  custom={i * 0.07}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md transition"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {paper.year && (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-full">
                        {paper.year}
                      </span>
                    )}
                    {paper.venue && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                        {paper.venue}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{paper.title}</h3>
                  <div className="flex gap-3 mt-3">
                    {paper.projectSlug && (
                      <Link href={`/research/${paper.projectSlug}`} className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition">
                        View research <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                      </Link>
                    )}
                    {paper.doiUrl && (
                      <a href={paper.doiUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition">
                        Read paper <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Research Interests ── */}
      {!loading && interests.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mb-10 max-w-2xl"
            >
              <SectionLabel>Research Interests</SectionLabel>
              <h2 className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-4">
                Directions I&apos;m exploring.
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                These are the areas where I want to contribute meaningfully — where engineering depth
                meets unsolved human problems.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {interests.map((interest, i) => {
                const icon = ICON_MAP[interest.iconName] || faCode;
                return (
                  <motion.div
                    key={interest.id}
                    variants={fadeUp}
                    custom={i * 0.08}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={icon} className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                      {interest.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {interest.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <motion.div
            className="rounded-3xl bg-gray-900 text-white overflow-hidden p-10 sm:p-14 relative"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
            </div>
            <div className="relative max-w-2xl">
              <SectionLabel>What&apos;s Next</SectionLabel>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                Open to research collaboration.
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
                I&apos;m always interested in connecting with researchers, engineers, and builders
                working on privacy-first AI, edge inference, and human-centered intelligent systems.
                If you&apos;re working on something interesting — reach out.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition shadow-sm"
                >
                  Get in touch <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition"
                >
                  View all projects
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
