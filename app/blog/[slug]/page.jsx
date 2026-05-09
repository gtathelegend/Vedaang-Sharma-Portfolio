"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchJson } from "@/lib/api";
import MarkdownRenderer from "@/components/MarkdownRenderer";

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJson(`/api/blog/posts/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-gray-400 dark:text-gray-500 text-sm">Loading…</div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-8"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> All posts
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post not found.</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-gray-100 dark:bg-white/5 blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 -right-24 h-72 w-72 rounded-full bg-blue-50 dark:bg-blue-500/10 blur-3xl opacity-40" />
      </div>

      <article className="mx-auto max-w-3xl px-6 sm:px-10 pt-28 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", delay: 0.05 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-10"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> All posts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          {post.publishedAt && (
            <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-4">
              <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
              {fmtDate(post.publishedAt)}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <hr className="mt-8 border-gray-100 dark:border-white/10" />
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          {post.content ? (
            <MarkdownRenderer>{post.content}</MarkdownRenderer>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 italic">No content yet.</p>
          )}
        </motion.div>
      </article>
    </main>
  );
}
