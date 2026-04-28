"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faBriefcase,
	faGraduationCap,
	faBookOpen,
	faMusic,
	faMapPin,
	faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const DEFAULTS = {
	focus: "Polishing my portfolio + a couple of side projects in full‑stack and AI.",
	learning: "Generative AI tooling, system design, and a touch of Rust.",
	reading: "Designing Data‑Intensive Applications — Martin Kleppmann.",
	listening: "Lo‑fi during deep work, indie rock the rest of the time.",
	location: "Jaipur, India.",
};

const ITEMS = [
	{ key: "focus", icon: faBriefcase, label: "Focus" },
	{ key: "learning", icon: faGraduationCap, label: "Learning" },
	{ key: "reading", icon: faBookOpen, label: "Reading" },
	{ key: "listening", icon: faMusic, label: "Listening" },
	{ key: "location", icon: faMapPin, label: "Based in" },
];

function formatUpdatedAt(iso) {
	if (!iso) return null;
	try {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return null;
	}
}

export default function NowPage() {
	const [now, setNow] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/now")
			.then((res) => mounted && setNow(res.data || {}))
			.catch(() => mounted && setError("Couldn't load /now right now."));
		return () => {
			mounted = false;
		};
	}, []);

	const updated = formatUpdatedAt(now?.updated_at);

	return (
		<main className="min-h-screen bg-white dark:bg-gray-950">
			{/* Hero */}
			<section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -top-12 right-1/4 h-72 w-72 rounded-full bg-emerald-50 blur-3xl opacity-70" />
					<div className="absolute top-1/3 left-0 h-64 w-64 rounded-full bg-blue-50 blur-3xl opacity-60" />
				</div>

				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-8"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
					</Link>

					<div className="flex flex-wrap items-end gap-3 mb-3">
						<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400">
							/now
						</p>
						<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
						</span>
					</div>

					<h1 className="text-gray-900 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl mb-5">
						What I&apos;m doing right now.
					</h1>
					<p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl">
						Inspired by{" "}
						<a
							href="https://nownownow.com/about"
							target="_blank"
							rel="noopener noreferrer"
							className="underline decoration-gray-300 hover:decoration-gray-900"
						>
							Derek Sivers&apos; /now movement
						</a>
						. A short, honest snapshot — refreshed whenever something meaningful changes.
					</p>
					{updated && (
						<p className="text-xs text-gray-400 mt-4">
							Last updated <span className="text-gray-500 font-medium">{updated}</span>
						</p>
					)}
				</div>
			</section>

			{/* Body */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					{error && <p className="text-red-500 mb-6">{error}</p>}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{ITEMS.map((item, i) => {
							const value = (now?.[item.key] ?? "").trim() || DEFAULTS[item.key];
							return (
								<motion.div
									key={item.key}
									initial={{ opacity: 0, y: 18 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.06 }}
									className="rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/60 p-6 sm:p-7 shadow-sm hover:shadow-md transition"
								>
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
											<FontAwesomeIcon icon={item.icon} />
										</div>
										<h2 className="text-base font-semibold text-gray-900">{item.label}</h2>
									</div>
									<p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
										{value}
									</p>
								</motion.div>
							);
						})}
					</div>

					<div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h3 className="text-base font-semibold text-gray-900 mb-1">
								Want to talk about any of this?
							</h3>
							<p className="text-sm text-gray-500">I&apos;m almost always up for a good chat.</p>
						</div>
						<Link
							href="/contact"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm"
						>
							<FontAwesomeIcon icon={faPaperPlane} /> Send a message
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
