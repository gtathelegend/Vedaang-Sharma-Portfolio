"use client";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchJson } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faCalendar,
  faCode,
  faLayerGroup,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import NotFound from "@/app/not-found";
import Image from "next/image";
import BlurImage from "@/public/image/placeholder/blur.jpg";
import Link from "next/link";

/* ─── tiny helpers ─────────────────────────────────────── */

function Tag({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
      {label}
    </span>
  );
}

function MetaBlock({ icon, label, children }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={icon} className="text-neutral-500 text-sm" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">{label}</p>
        <div className="text-neutral-800 font-medium">{children}</div>
      </div>
    </div>
  );
}

/* ─── loading skeleton ─────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="h-[55vh] bg-neutral-200 w-full" />
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-10 bg-neutral-200 rounded w-2/3" />
          <div className="h-4 bg-neutral-200 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-5/6" />
          <div className="h-4 bg-neutral-200 rounded w-4/6" />
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

/* ─── image lightbox ───────────────────────────────────── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-5xl w-full max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full text-white text-lg flex items-center justify-center transition"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── main page ────────────────────────────────────────── */
export default function Page(props) {
  const params = use(props.params);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchJson("/api/projects")
      .then((res) => {
        if (!mounted) return;
        const found = (res.data || []).find((p) => p.slug === params.slug);
        setData(found || "404");
      })
      .catch(() => mounted && setError("Unable to load this project."))
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, [params.slug]);

  if (isLoading) return <Skeleton />;
  if (data === "404") return <NotFound />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  const desc = data.desc || data.description || [];
  const tech = data.tech || data.techStack || [];
  const thumbnail = data.thumbnail || data.imageUrl || null;
  const images = data.images || [];

  return (
    <div className="bg-white min-h-screen">
      {/* ── Back button ── */}
      <Link
        href="/projects"
        className="fixed top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:bg-white transition shadow-sm"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
        All Projects
      </Link>

      {/* ── Hero / Thumbnail ── */}
      <motion.div
        className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] bg-neutral-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={data.title}
            fill
            priority
            className="object-cover opacity-70"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-14">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {data.year && (
              <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-white/60 border border-white/20 px-3 py-1 rounded-full">
                {data.year}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight">
              {data.title}
            </h1>
            {/* Tech tags in hero */}
            {tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tech.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/80 backdrop-blur border border-white/10"
                  >
                    {t}
                  </span>
                ))}
                {tech.length > 6 && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/80">
                    +{tech.length - 6} more
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* Description column (2/3) */}
        <motion.div
          className="lg:col-span-2 space-y-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-neutral-900 rounded-full" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                About this project
              </h2>
            </div>
            <div className="space-y-4">
              {desc.length > 0 ? (
                desc.map((para, i) => (
                  <p key={i} className="text-neutral-600 text-base sm:text-lg leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-neutral-400 italic">No description provided.</p>
              )}
            </div>
          </div>

          {/* Full tech stack */}
          {tech.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-neutral-900 rounded-full" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Tech Stack
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => <Tag key={t} label={t} />)}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {data.preview && (
              <a
                href={data.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition"
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                Live Preview
              </a>
            )}
            {data.code && (
              <a
                href={data.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition"
              >
                <FontAwesomeIcon icon={faGithub} />
                Source Code
              </a>
            )}
          </div>
        </motion.div>

        {/* Sidebar (1/3) */}
        <motion.aside
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="rounded-2xl border border-neutral-200 p-6 space-y-6 bg-neutral-50">
            {data.year && (
              <MetaBlock icon={faCalendar} label="Year">
                {data.year}
              </MetaBlock>
            )}

            {data.status && (
              <MetaBlock icon={faLayerGroup} label="Status">
                <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${
                  data.status === "published" ? "bg-green-100 text-green-700" :
                  data.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                  "bg-neutral-200 text-neutral-600"
                }`}>
                  {data.status}
                </span>
              </MetaBlock>
            )}

            {tech.length > 0 && (
              <MetaBlock icon={faCode} label="Technologies">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {tech.join(" · ")}
                </p>
              </MetaBlock>
            )}

            {images.length > 0 && (
              <MetaBlock icon={faImages} label="Screenshots">
                <p className="text-sm text-neutral-600">{images.length} image{images.length !== 1 ? "s" : ""}</p>
              </MetaBlock>
            )}
          </div>

          {/* Quick links card */}
          {(data.preview || data.code) && (
            <div className="rounded-2xl border border-neutral-200 p-6 space-y-3 bg-white">
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Links</p>
              {data.preview && (
                <a
                  href={data.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group px-4 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-700 transition"
                >
                  <span className="text-sm font-medium">Live Preview</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-white/60 group-hover:text-white transition" />
                </a>
              )}
              {data.code && (
                <a
                  href={data.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group px-4 py-3 rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-50 transition"
                >
                  <span className="text-sm font-medium">GitHub Repo</span>
                  <FontAwesomeIcon icon={faGithub} className="text-neutral-400 group-hover:text-neutral-800 transition" />
                </a>
              )}
            </div>
          )}
        </motion.aside>
      </div>

      {/* ── Image Gallery ── */}
      {images.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-neutral-900 rounded-full" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Screenshots
            </h2>
          </div>
          <div className={`grid gap-4 ${images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {images.map((img, i) => (
              <motion.div
                key={i}
                className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 cursor-zoom-in group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setLightbox({ src: img, alt: `Screenshot ${i + 1}` })}
              >
                <Image
                  src={img}
                  alt={`${data.title} screenshot ${i + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
                    Click to expand
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
