"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
	ActivityIcon,
	CodepenIcon,
	WebhookIcon,
	MobileIcon,
	DatabaseIcon,
	CloudIcon,
	ToolsIcon,
} from "@/app/about/components/skills/icons";

/* ─────────────────────────────────────────────
   Config
   ───────────────────────────────────────────── */

const CATEGORY_META = {
	frontend: { title: "Frontend",      icon: CodepenIcon,  description: "Modern, responsive web interfaces" },
	backend:  { title: "Backend / API", icon: WebhookIcon,  description: "Robust, scalable server-side services" },
	ai:       { title: "AI & ML",       icon: ActivityIcon, description: "Intelligent solutions with ML and LLMs" },
	mobile:   { title: "Mobile",        icon: MobileIcon,   description: "Cross-platform mobile experiences" },
	devops:   { title: "DevOps",        icon: CloudIcon,    description: "CI/CD, containers, cloud infrastructure" },
	database: { title: "Databases",     icon: DatabaseIcon, description: "Relational and NoSQL data stores" },
	other:    { title: "Other",         icon: ToolsIcon,    description: "Tools, platforms, and extras" },
};

const CATEGORY_THEMES = {
	frontend: { grad: "from-blue-500 to-cyan-500",     soft: "from-blue-50 to-cyan-50",     softDark: "dark:from-blue-500/10 dark:to-cyan-500/10",     pill: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" },
	backend:  { grad: "from-violet-500 to-purple-600", soft: "from-violet-50 to-purple-50", softDark: "dark:from-violet-500/10 dark:to-purple-500/10", pill: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300" },
	ai:       { grad: "from-pink-500 to-rose-500",     soft: "from-pink-50 to-rose-50",     softDark: "dark:from-pink-500/10 dark:to-rose-500/10",     pill: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300" },
	mobile:   { grad: "from-emerald-500 to-teal-500",  soft: "from-emerald-50 to-teal-50",  softDark: "dark:from-emerald-500/10 dark:to-teal-500/10",  pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" },
	devops:   { grad: "from-orange-500 to-amber-500",  soft: "from-orange-50 to-amber-50",  softDark: "dark:from-orange-500/10 dark:to-amber-500/10",  pill: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300" },
	database: { grad: "from-indigo-500 to-blue-600",   soft: "from-indigo-50 to-blue-50",   softDark: "dark:from-indigo-500/10 dark:to-blue-500/10",   pill: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" },
	other:    { grad: "from-slate-500 to-gray-600",    soft: "from-slate-50 to-gray-100",   softDark: "dark:from-slate-500/10 dark:to-gray-500/10",    pill: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300" },
};


const themeFor = (k) => CATEGORY_THEMES[k] || CATEGORY_THEMES.other;
const metaFor  = (k) => CATEGORY_META[k]   || { title: k, description: "", icon: ActivityIcon };

// Render order guarantees every row sums to 3 columns
const BENTO_ORDER = ['frontend', 'ai', 'mobile', 'backend', 'devops', 'database', 'other'];
// Which categories get the wide (col-span-2) card
const BENTO_SPAN_MAP = { frontend: 2, backend: 2, database: 2 };

/* ─────────────────────────────────────────────
   Skill chip - compact, shows level dots
   ───────────────────────────────────────────── */

function SkillChip({ skill }) {
	return (
		<div className="flex items-center px-3 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
			<span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
				{skill.name}
			</span>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Category section card - fully self-contained
   ───────────────────────────────────────────── */

function CategorySection({ k, skills, index, span = 1 }) {
	const meta  = metaFor(k);
	const theme = themeFor(k);
	const Icon  = meta.icon;
	const chipsGrid = span === 2
		? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5"
		: "grid-cols-2 sm:grid-cols-3";

	return (
		<motion.div
			id={`cat-${k}`}
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.08 }}
			transition={{ delay: index * 0.04, type: "spring", stiffness: 80, damping: 18 }}
			className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-[0_2px_20px_-8px_rgb(0_0_0_/_0.08)] dark:shadow-none scroll-mt-[130px] h-full"
		>
			{/* Gradient header */}
			<div className={`bg-gradient-to-br ${theme.grad} relative overflow-hidden`}>
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
				</div>
				<div className="relative flex items-center gap-3 px-5 py-4">
					<div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
						<Icon className="w-5 h-5" />
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-base font-bold text-white leading-tight">{meta.title}</h2>
						<p className="text-xs text-white/75 mt-0.5 leading-tight">{meta.description}</p>
					</div>
					<span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold text-white">
						<span className="w-1 h-1 rounded-full bg-white animate-pulse" />
						{skills.length}
					</span>
				</div>
			</div>

			{/* Skills grid */}
			<div className={`bg-gradient-to-br ${theme.soft} ${theme.softDark} p-4`}>
				<div className={`grid ${chipsGrid} gap-2`}>
					{skills.map((skill) => (
						<SkillChip key={skill.name} skill={skill} />
					))}
				</div>
			</div>
		</motion.div>
	);
}

/* ─────────────────────────────────────────────
   Skeleton loader
   ───────────────────────────────────────────── */

function Skeleton() {
	// Mirrors BENTO_ORDER + BENTO_SPAN_MAP: frontend(2),ai(1),mobile(1),backend(2),devops(1),database(2),other(1)
	const skeletonSpans = [2, 1, 1, 2, 1, 2, 1];
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-pulse">
			{skeletonSpans.map((span, i) => (
				<div key={i} className={span === 2 ? "lg:col-span-2" : "lg:col-span-1"}>
					<div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
						<div className="h-16 bg-gray-200 dark:bg-white/10" />
						<div className={`p-4 bg-gray-50 dark:bg-white/5 grid gap-2 ${span === 2 ? "grid-cols-4" : "grid-cols-3"}`}>
							{Array.from({ length: span === 2 ? 8 : 4 }).map((_, j) => (
								<div key={j} className="h-9 rounded-xl bg-gray-200 dark:bg-white/10" />
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

export default function SkillsPage() {
	const [skillsByCategory, setSkillsByCategory] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/skills")
			.then((res) => {
				if (!mounted) return;
				setSkillsByCategory(res.data || {});
			})
			.catch(() => mounted && setError("Failed to load skills."));
		return () => { mounted = false; };
	}, []);

	const categories = skillsByCategory
		? Object.keys(skillsByCategory).filter((k) => (skillsByCategory[k] || []).length > 0)
		: [];

	const totalSkills = categories.reduce(
		(sum, k) => sum + (skillsByCategory?.[k]?.length || 0), 0
	);

	return (
		<main className="min-h-screen bg-transparent">

			{/* ── Compact hero ── */}
			<section className="relative pt-28 md:pt-32 pb-8 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-blue-100 dark:bg-blue-500/15 blur-3xl opacity-60" />
					<div className="absolute top-0 right-1/4 h-56 w-56 rounded-full bg-violet-100 dark:bg-violet-500/15 blur-3xl opacity-50" />
				</div>

				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-8"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" /> Back home
					</Link>

					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
						<div>
							<p className="text-[11px] font-bold uppercase tracking-[.35rem] mb-3">
								<span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
									My toolkit
								</span>
							</p>
							<h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
								Skills &amp; technologies.
							</h1>
							<p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed mt-3 max-w-xl">
								Everything I&apos;ve actually shipped with - organised by area, with proficiency shown inline.
							</p>
						</div>

						{/* Quick stats inline */}
						{skillsByCategory && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
								className="flex gap-4 shrink-0"
							>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSkills}+</div>
									<div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Skills</div>
								</div>
								<div className="w-px bg-gray-200 dark:bg-white/10" />
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</div>
									<div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Areas</div>
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</section>

{/* ── All categories - 2-column grid, always visible ── */}
			<section className="py-10 pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					{error && <p className="text-red-500 mb-6">{error}</p>}

					{skillsByCategory === null ? (
						<Skeleton />
					) : categories.length === 0 ? (
						<p className="text-gray-500 italic">No skills added yet.</p>
					) : (
						<>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
								{[
									...BENTO_ORDER.filter(k => (skillsByCategory[k] || []).length > 0),
									...categories.filter(k => !BENTO_ORDER.includes(k)),
								].map((k, i) => {
									const span = BENTO_SPAN_MAP[k] ?? 1;
									return (
										<div key={k} className={span === 2 ? "lg:col-span-2" : "lg:col-span-1"}>
											<CategorySection
												k={k}
												skills={skillsByCategory[k] || []}
												index={i}
												span={span}
											/>
										</div>
									);
								})}
							</div>

							{/* CTA */}
							<motion.div
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ type: "spring", stiffness: 90, damping: 18 }}
								className="mt-12 relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-violet-900 to-blue-900 p-8 sm:p-12"
							>
								<div className="pointer-events-none absolute inset-0">
									<div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
									<div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
								</div>
								<div className="relative max-w-2xl">
									<h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
										See these in action.
									</h3>
									<p className="text-sm text-white/70 mb-6">
										Skills only mean something when applied - browse the projects where I&apos;ve put them to work.
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
											Have a project? Let&apos;s talk
										</Link>
									</div>
								</div>
							</motion.div>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
