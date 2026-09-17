"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faArrowRight,
  faArrowUpRightFromSquare,
  faCertificate,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const CATEGORY_COLORS = {
  AI:       "bg-blue-50   dark:bg-blue-500/10   text-blue-700   dark:text-blue-300   border-blue-100   dark:border-blue-500/20",
  DevOps:   "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-500/20",
  Cloud:    "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/20",
  Security: "bg-red-50    dark:bg-red-500/10    text-red-700    dark:text-red-300    border-red-100    dark:border-red-500/20",
  Backend:  "bg-green-50  dark:bg-green-500/10  text-green-700  dark:text-green-300  border-green-100  dark:border-green-500/20",
  Frontend: "bg-cyan-50   dark:bg-cyan-500/10   text-cyan-700   dark:text-cyan-300   border-cyan-100   dark:border-cyan-500/20",
  Mobile:   "bg-pink-50   dark:bg-pink-500/10   text-pink-700   dark:text-pink-300   border-pink-100   dark:border-pink-500/20",
  Other:    "bg-gray-50   dark:bg-white/5        text-gray-600   dark:text-gray-400   border-gray-200   dark:border-white/10",
};

const CATEGORY_ICON_COLORS = {
  AI:       "bg-blue-100   dark:bg-blue-500/20   text-blue-600   dark:text-blue-400",
  DevOps:   "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400",
  Cloud:    "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
  Security: "bg-red-100    dark:bg-red-500/20    text-red-600    dark:text-red-400",
  Backend:  "bg-green-100  dark:bg-green-500/20  text-green-600  dark:text-green-400",
  Frontend: "bg-cyan-100   dark:bg-cyan-500/20   text-cyan-600   dark:text-cyan-400",
  Mobile:   "bg-pink-100   dark:bg-pink-500/20   text-pink-600   dark:text-pink-400",
  Other:    "bg-gray-100   dark:bg-white/5        text-gray-600   dark:text-gray-400",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18, delay },
  }),
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-white/10" />
        <div className="w-16 h-5 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded mb-2 w-4/5" />
      <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-2/5" />
    </div>
  );
}

function CertCard({ cert, index }) {
  const iconColor = CATEGORY_ICON_COLORS[cert.category] || CATEGORY_ICON_COLORS.Other;
  const badgeColor = CATEGORY_COLORS[cert.category] || CATEGORY_COLORS.Other;

  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.05}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="group rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
    >
      {/* Top row: icon + category badge */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <FontAwesomeIcon icon={faCertificate} className="text-sm" />
        </div>
        {cert.category && (
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeColor}`}>
            {cert.category}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug flex-1">
        {cert.name}
      </h3>

      {/* Bottom row: issuer + year + link */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {[cert.issuer, cert.year].filter(Boolean).join(" · ")}
        </p>
        {cert.url && (
          <a
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            aria-label={`View ${cert.name} certificate`}
          >
            <span className="sr-only">View {cert.name} certificate</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" aria-hidden="true" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function CertificationsPage() {
  const [certs, setCerts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJson("/api/certifications")
      .then((res) => setCerts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(certs.map((c) => c.category).filter(Boolean)))];
  const filtered   = activeFilter === "All" ? certs : certs.filter((c) => c.category === activeFilter);

  return (
    <main className="overflow-hidden bg-transparent min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[55svh] flex items-center overflow-hidden pt-24 pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-blue-50 dark:bg-blue-500/10 blur-3xl opacity-60" />
          <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-purple-50 dark:bg-purple-500/10 blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-50 dark:bg-cyan-500/5 blur-3xl opacity-40" />
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
            Credentials
          </motion.p>

          <motion.h1
            className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.15 }}
          >
            Skills, verified<br className="hidden sm:block" /> and earned.
          </motion.h1>

          <motion.p
            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.25 }}
          >
            Curated credentials in AI, cloud, and engineering — the ones that reflect where I focus and what I&apos;ve committed to mastering.
          </motion.p>

          {/* Stats */}
          {!loading && certs.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.35 }}
            >
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{certs.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Certifications</div>
              </div>
              <div className="w-px bg-gray-200 dark:bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Categories</div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-10 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

          {/* Category filter pills */}
          {!loading && categories.length > 2 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <FontAwesomeIcon icon={faFilter} className="text-gray-400 dark:text-gray-500 text-xs self-center mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all duration-150 ${
                    activeFilter === cat
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                      : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/25"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">No certifications found.</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {filtered.map((cert, i) => (
                  <CertCard key={cert.id} cert={cert} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* CTA */}
          {!loading && (
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-16 relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/80 to-purple-900 p-8 sm:p-12"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
              </div>
              <div className="relative max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[.35rem] text-blue-300 mb-3">
                  What&apos;s Next
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  See these in action.
                </h3>
                <p className="text-sm text-white/70 mb-6">
                  Credentials only matter when applied — explore the projects and research where I&apos;ve put them to work.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition shadow-lg"
                  >
                    View projects <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
