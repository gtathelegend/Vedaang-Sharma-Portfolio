"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

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

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJson("/api/blog/posts")
      .then((res) => setPosts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasPosts = !loading && posts.length > 0;

  return (
    <main className="overflow-hidden bg-transparent min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[60svh] flex items-center overflow-hidden pt-24 pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-gray-100 dark:bg-white/5 blur-3xl opacity-70" />
          <div className="absolute bottom-1/4 -right-16 h-64 w-64 rounded-full bg-blue-50 dark:bg-blue-500/10 blur-3xl opacity-50" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-8"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.05 }}
          >
            <SectionLabel>Writing</SectionLabel>
          </motion.div>

          <motion.h1
            className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.15 }}
          >
            {hasPosts ? (
              <>Thoughts &amp; articles.</>
            ) : (
              <>Technical writing,<br className="hidden sm:block" /> coming soon.</>
            )}
          </motion.h1>

          <motion.p
            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", delay: 0.25 }}
          >
            {hasPosts
              ? "Articles on AI engineering, system architecture, and building software that actually works."
              : "I’m working on articles about AI engineering, system architecture, and building software that actually works. The kind of writing I wish I could find when I was stuck."}
          </motion.p>
        </div>
      </section>

      {/* ── Posts list ── */}
      {hasPosts && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col gap-6 max-w-3xl">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  variants={fadeUp}
                  custom={i * 0.07}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md transition"
                  >
                    {post.publishedAt && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
                        <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                        {fmtDate(post.publishedAt)}
                      </p>
                    )}
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                      Read article <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA shown only when no posts yet ── */}
      {!hasPosts && !loading && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
            <motion.div
              className="rounded-3xl border border-gray-100 dark:border-white/10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/60 p-10 sm:p-14 shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.06)] dark:shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.4)]"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <SectionLabel>In the meantime</SectionLabel>
              <h2 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                Follow the work as it happens.
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8 max-w-xl">
                Until the articles are ready — GitHub is where the thinking happens in real time,
                and LinkedIn is where I share updates on what I&apos;m building.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/vedaangsharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-sm"
                >
                  <FontAwesomeIcon icon={faGithub} /> Follow on GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/vedaang-sharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <FontAwesomeIcon icon={faLinkedin} /> Connect on LinkedIn
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  Send a message <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
