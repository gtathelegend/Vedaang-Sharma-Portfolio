"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

import Me from "@/public/image/me.jpg";
import MeAbout from "@/public/image/me2.jpg";
import BlurImage from "@/public/image/placeholder/blur.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
	faArrowRight,
	faCode,
	faFolderOpen,
	faUser,
	faPaperPlane,
	faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import TerminalIntro from "@/components/TerminalIntro";
import GithubActivity from "@/components/GithubActivity";
import {
	ActivityIcon,
	CodepenIcon,
	WebhookIcon,
	MobileIcon,
	DatabaseIcon,
	CloudIcon,
	ToolsIcon,
} from "@/app/about/components/skills/icons";

const fadeUp = {
	hidden: { y: 30, opacity: 0 },
	visible: (delay = 0) => ({
		y: 0,
		opacity: 1,
		transition: { type: "spring", delay, stiffness: 90, damping: 18 },
	}),
};

const slideLeft = {
	hidden: { x: -40, opacity: 0 },
	visible: (delay = 0) => ({
		x: 0,
		opacity: 1,
		transition: { type: "spring", delay, stiffness: 90, damping: 18 },
	}),
};

const slideRight = {
	hidden: { x: 40, opacity: 0 },
	visible: (delay = 0) => ({
		x: 0,
		opacity: 1,
		transition: { type: "spring", delay, stiffness: 90, damping: 18 },
	}),
};

/* ─────────────────────────────────────────────
   Reusable bits
   ───────────────────────────────────────────── */

function SectionLabel({ children, className = "" }) {
	return (
		<span className={`inline-block text-[10px] font-bold uppercase tracking-[.35rem] text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 px-3 py-1.5 rounded-full mb-5 ${className}`}>
			{children}
		</span>
	);
}

function PrimaryLink({ href, children, external = false }) {
	const props = external
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};
	const Tag = external ? "a" : Link;
	return (
		<Tag
			href={href}
			{...props}
			className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-sm"
		>
			{children}
		</Tag>
	);
}

function SecondaryLink({ href, children, external = false }) {
	const props = external
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};
	const Tag = external ? "a" : Link;
	return (
		<Tag
			href={href}
			{...props}
			className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition"
		>
			{children}
		</Tag>
	);
}

/* ─────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────── */

function HeroSection({ fullName, tagline, heroSubtitle, cvUrl }) {
	return (
		<section
			id="home"
			className="relative isolate min-h-[100svh] flex items-center overflow-hidden bg-transparent pt-28 md:pt-0"
		>
			{/* Right portrait (desktop) */}
			<motion.div
				className="hidden md:block absolute top-0 right-0 h-full w-[42vw] lg:w-[40vw] -z-0"
				variants={slideRight}
				custom={0.1}
				initial="hidden"
				animate="visible"
			>
				<div
					className="relative h-full w-full"
					style={{
						WebkitMaskImage: [
							"linear-gradient(to right, transparent 0%, black 30%)",
							"linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)",
						].join(", "),
						WebkitMaskComposite: "source-in",
						maskImage: [
							"linear-gradient(to right, transparent 0%, black 30%)",
							"linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)",
						].join(", "),
						maskComposite: "intersect",
					}}
				>
					<Image
						src={Me}
						fill
						className="object-cover object-top"
						style={{ filter: "none" }}
						alt={fullName}
						placeholder="blur"
						priority
						sizes="(max-width: 768px) 0px, 42vw"
					/>
				</div>
			</motion.div>

			{/* Content */}
			<div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-20 py-24 md:py-32">
				<div className="md:max-w-[52%] lg:max-w-[46%]">

					{/* Mobile portrait */}
					<div className="flex md:hidden justify-center mb-10 sm:mb-14">
						<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-xl">
							<Image
								src={Me}
								width={128}
								height={128}
								className="object-cover object-top w-full h-full"
								style={{ filter: "none" }}
								alt={fullName}
								placeholder="blur"
							/>
						</div>
					</div>

					{/* Name eyebrow */}
					<motion.p
						className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 mb-8"
						variants={slideLeft}
						custom={0.12}
						initial="hidden"
						animate="visible"
					>
						{fullName}
					</motion.p>

					{/* Heading */}
					<motion.h1
						className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8 sm:mb-12"
						variants={slideLeft}
						custom={0.22}
						initial="hidden"
						animate="visible"
					>
						{tagline}
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						className="text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl leading-[1.7] max-w-xl mb-10 sm:mb-16"
						variants={slideLeft}
						custom={0.32}
						initial="hidden"
						animate="visible"
					>
						{heroSubtitle}
					</motion.p>

					{/* CTAs */}
					<motion.div
						className="flex flex-wrap items-center gap-4"
						variants={fadeUp}
						custom={0.42}
						initial="hidden"
						animate="visible"
					>
						<a
							href={cvUrl}
							download
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-sm"
						>
							Download CV <FontAwesomeIcon icon={faArrowRight} />
						</a>
						<SecondaryLink href="/contact">Get in touch</SecondaryLink>
					</motion.div>

					{/* Quiet social row */}
					<motion.div
						className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3"
						variants={fadeUp}
						custom={0.55}
						initial="hidden"
						animate="visible"
					>
						<a
							href="https://github.com/vedaangsharma"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
						>
							<FontAwesomeIcon icon={faGithub} className="text-base" />
							GitHub
						</a>
						<a
							href="https://www.linkedin.com/in/vedaang-sharma"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
						>
							LinkedIn
						</a>
						<Link
							href="/contact"
							className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
						>
							Email
						</Link>
					</motion.div>

				</div>
			</div>

			{/* Scroll cue */}
			<motion.div
				className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.4 }}
			>
				<span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600">scroll</span>
				<motion.div
					className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 origin-top"
					animate={{ scaleY: [0.2, 1, 0.2] }}
					transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
				/>
			</motion.div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Section card wrapper - every section after hero
   ───────────────────────────────────────────── */

function SectionCard({ id, label, heading, lead, children }) {
	return (
		<section id={id} className="py-20 md:py-28 bg-transparent">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<div className="rounded-3xl border border-amber-200/40 dark:border-white/10 bg-gradient-to-br from-[#FFFBEB]/95 to-[#FAFAF9]/90 dark:from-gray-900 dark:to-gray-900/40 shadow-[0_8px_40px_-16px_rgba(245,158,11,0.18)] dark:shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.6)] overflow-hidden">
					<div className="p-6 sm:p-10 md:p-14">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ type: "spring", stiffness: 90, damping: 18 }}
							viewport={{ once: true, amount: 0.2 }}
							className="mb-8 sm:mb-10 max-w-2xl"
						>
							<SectionLabel>{label}</SectionLabel>
							<h2 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
								{heading}
							</h2>
							{lead && (
								<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">{lead}</p>
							)}
						</motion.div>
						{children}
					</div>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Skills preview
   ───────────────────────────────────────────── */

const SKILL_CATEGORY_META = {
	frontend: { title: "Frontend",      icon: CodepenIcon,  description: "Modern, responsive web interfaces" },
	backend:  { title: "Backend / API", icon: WebhookIcon,  description: "Robust, scalable server-side services" },
	ai:       { title: "AI & ML",       icon: ActivityIcon, description: "Intelligent solutions with ML and LLMs" },
	mobile:   { title: "Mobile",        icon: MobileIcon,   description: "Cross-platform mobile experiences" },
	devops:   { title: "DevOps",        icon: CloudIcon,    description: "CI/CD, containers, cloud infrastructure" },
	database: { title: "Databases",     icon: DatabaseIcon, description: "Relational and NoSQL data stores" },
	other:    { title: "Other",         icon: ToolsIcon,    description: "Tools, platforms, and extras" },
};

// Home preview bento - same order/spans as skills page, capped at 6 categories
const HOME_BENTO_ORDER = ['frontend', 'ai', 'mobile', 'backend', 'devops', 'database'];
const HOME_BENTO_SPAN_MAP = { frontend: 2, backend: 2, database: 2 };

const SKILL_CATEGORY_THEMES = {
	frontend: { grad: "from-blue-500 to-cyan-500",     soft: "from-blue-50 to-cyan-50",     softDark: "dark:from-blue-500/10 dark:to-cyan-500/10" },
	backend:  { grad: "from-violet-500 to-purple-600", soft: "from-violet-50 to-purple-50", softDark: "dark:from-violet-500/10 dark:to-purple-500/10" },
	ai:       { grad: "from-pink-500 to-rose-500",     soft: "from-pink-50 to-rose-50",     softDark: "dark:from-pink-500/10 dark:to-rose-500/10" },
	mobile:   { grad: "from-emerald-500 to-teal-500",  soft: "from-emerald-50 to-teal-50",  softDark: "dark:from-emerald-500/10 dark:to-teal-500/10" },
	devops:   { grad: "from-orange-500 to-amber-500",  soft: "from-orange-50 to-amber-50",  softDark: "dark:from-orange-500/10 dark:to-amber-500/10" },
	database: { grad: "from-indigo-500 to-blue-600",   soft: "from-indigo-50 to-blue-50",   softDark: "dark:from-indigo-500/10 dark:to-blue-500/10" },
	other:    { grad: "from-slate-500 to-gray-600",    soft: "from-slate-50 to-gray-100",   softDark: "dark:from-slate-500/10 dark:to-gray-500/10" },
};

function SkillsPreview() {
	const [skillsByCategory, setSkillsByCategory] = useState(null);

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/skills")
			.then((res) => mounted && setSkillsByCategory(res.data || {}))
			.catch(() => mounted && setSkillsByCategory({}));
		return () => { mounted = false; };
	}, []);

	const categories = skillsByCategory
		? Object.entries(skillsByCategory).filter(([, list]) => Array.isArray(list) && list.length > 0)
		: null;

	return (
		<SectionCard
			id="skills"
			label="What I do"
			heading="Skills & Technologies"
			lead="A snapshot of the stacks I work with day‑to‑day - from modern web frameworks to AI tooling and cloud infrastructure."
		>
			{categories === null ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
					{/* Mirrors HOME_BENTO_ORDER+SPAN_MAP: frontend(2),ai(1),mobile(1),backend(2),devops(1),database(2) */}
					{[2, 1, 1, 2, 1, 2].map((span, i) => (
						<div key={i} className={span === 2 ? "lg:col-span-2" : "lg:col-span-1"}>
							<div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
								<div className="h-16 bg-gray-200 dark:bg-white/10" />
								<div className={`p-4 bg-gray-50 dark:bg-white/5 grid gap-2 grid-cols-2 ${span === 2 ? "sm:grid-cols-3" : ""}`}>
									{Array.from({ length: span === 2 ? 6 : 4 }).map((_, j) => (
										<div key={j} className="h-9 rounded-xl bg-gray-200 dark:bg-white/10" />
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			) : categories.length === 0 ? (
				<p className="text-gray-500 italic">Skills coming soon.</p>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{[
							...HOME_BENTO_ORDER.filter(k => skillsByCategory?.[k]?.length > 0),
							...Object.keys(skillsByCategory || {}).filter(k => !HOME_BENTO_ORDER.includes(k) && skillsByCategory[k]?.length > 0),
						].slice(0, 6).map((key, i) => {
							const list  = skillsByCategory?.[key] || [];
							const span  = HOME_BENTO_SPAN_MAP[key] ?? 1;
							const meta  = SKILL_CATEGORY_META[key]   || { title: key, description: "", icon: ActivityIcon };
							const theme = SKILL_CATEGORY_THEMES[key] || SKILL_CATEGORY_THEMES.other;
							const Icon      = meta.icon;
							const top       = list.slice(0, span === 2 ? 6 : 4);
							const chipsGrid = span === 2 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
							return (
								<div key={key} className={span === 2 ? "lg:col-span-2" : "lg:col-span-1"}>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.06, type: "spring", stiffness: 90, damping: 18 }}
										viewport={{ once: true, amount: 0.2 }}
										className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.08)] hover:shadow-md transition h-full"
									>
										{/* Gradient header - identical to skills page */}
										<div className={`bg-gradient-to-br ${theme.grad} relative overflow-hidden`}>
											<div className="pointer-events-none absolute inset-0">
												<div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
											</div>
											<div className="relative flex items-center gap-3 px-5 py-4">
												<div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
													<Icon className="w-5 h-5" />
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="text-base font-bold text-white leading-tight">{meta.title}</h3>
													<p className="text-xs text-white/75 mt-0.5 leading-tight">{meta.description}</p>
												</div>
												<span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold text-white">
													<span className="w-1 h-1 rounded-full bg-white animate-pulse" />
													{list.length}
												</span>
											</div>
										</div>

										{/* Skill chips */}
										<div className={`bg-gradient-to-br ${theme.soft} ${theme.softDark} p-4`}>
											<div className={`grid ${chipsGrid} gap-2`}>
												{top.map((s) => (
													<div
														key={s.name}
														className="flex items-center px-3 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-white/80 dark:border-white/10 shadow-sm"
													>
														<span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{s.name}</span>
													</div>
												))}
											</div>
											{list.length > top.length && (
												<p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-3 px-1">
													+{list.length - top.length} more on skills page
												</p>
											)}
										</div>
									</motion.div>
								</div>
							);
						})}
					</div>
					<div className="mt-8">
						<PrimaryLink href="/skills">
							Explore all skills <FontAwesomeIcon icon={faArrowRight} />
						</PrimaryLink>
					</div>
				</>
			)}
		</SectionCard>
	);
}

/* ─────────────────────────────────────────────
   Featured projects preview
   ───────────────────────────────────────────── */

function FeaturedProjectsPreview() {
	const [projects, setProjects] = useState(null);

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/projects")
			.then((res) => mounted && setProjects(res.data || []))
			.catch(() => mounted && setProjects([]));
		return () => {
			mounted = false;
		};
	}, []);

	const visible =
		(projects || []).filter(
			(p) => p.show !== false && p.status !== "draft" && p.status !== "archived",
		);
	const featured = visible.filter((p) => p.featured);
	const display = (featured.length > 0 ? featured : visible).slice(0, 3);

	return (
		<SectionCard
			id="projects-preview"
			label="My work"
			heading="Featured Projects"
			lead="A few hand‑picked projects that show the kind of problems I enjoy solving - full‑stack, AI, and everything in between."
		>
			{projects === null ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 animate-pulse">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="aspect-[4/3] rounded-2xl bg-gray-100" />
					))}
				</div>
			) : display.length === 0 ? (
				<p className="text-gray-500 italic">Projects are on the way.</p>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
						{display.map((project, i) => {
							const tech = project.tech || project.techStack || [];
							const desc = project.desc || project.description || [];
							const thumb = project.thumbnail || project.imageUrl;
							return (
								<motion.div
									key={project.id || project.slug || i}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.08, type: "spring", stiffness: 90, damping: 18 }}
									viewport={{ once: true, amount: 0.2 }}
									className="group rounded-2xl border border-amber-100 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] overflow-hidden hover:shadow-lg hover:border-amber-200 transition"
								>
									<Link href={`/projects/${project.slug}`} className="block">
										<div className="relative aspect-[4/3] bg-gray-100 dark:bg-white/5 overflow-hidden">
											<Image
												src={thumb || BlurImage}
												alt={project.title || "Project"}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
												sizes="(max-width: 768px) 100vw, 33vw"
												placeholder="blur"
												blurDataURL={BlurImage.src}
											/>
										</div>
										<div className="p-5">
											<h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-gray-700 dark:group-hover:text-gray-200">
												{project.title}
											</h3>
											{desc[0] && (
												<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{desc[0]}</p>
											)}
											{tech.length > 0 && (
												<div className="flex flex-wrap gap-1.5">
													{tech.map((t) => (
														<span
															key={t}
															className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
														>
															{t}
														</span>
													))}
												</div>
											)}
										</div>
									</Link>
								</motion.div>
							);
						})}
					</div>
					<div className="mt-8 flex flex-wrap gap-3">
						<PrimaryLink href="/projects">
							View all projects <FontAwesomeIcon icon={faArrowRight} />
						</PrimaryLink>
						<SecondaryLink href="/projects/archive">Browse archive</SecondaryLink>
					</div>
				</>
			)}
		</SectionCard>
	);
}

/* ─────────────────────────────────────────────
   About preview
   ───────────────────────────────────────────── */

function AboutPreview() {
	return (
		<section id="about" className="py-20 md:py-28 bg-transparent">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<div className="rounded-3xl border border-amber-200/40 dark:border-white/10 bg-gradient-to-br from-[#FFFBEB]/95 to-[#FAFAF9]/90 dark:bg-white/[0.03] shadow-[0_8px_40px_-16px_rgba(245,158,11,0.18)] dark:shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.6)] overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2">
						<motion.div
							className="relative min-h-[320px] md:min-h-[480px] bg-gray-50 dark:bg-white/5"
							initial={{ opacity: 0, scale: 0.96 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ type: "spring", stiffness: 80, damping: 20 }}
							viewport={{ once: true, amount: 0.2 }}
						>
							<Image
								src={MeAbout}
								alt="About Vedaang"
								fill
								className="object-cover object-center transition-all duration-700"
								placeholder="blur"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
						</motion.div>

						<div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ type: "spring", stiffness: 90, damping: 18 }}
								viewport={{ once: true, amount: 0.2 }}
							>
								<SectionLabel>About me</SectionLabel>
								<h2 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
									Building thoughtful, modern software.
								</h2>
								<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-5">
									I&apos;m a full‑stack developer and AI systems builder based in Jaipur - studying CS
									at Vivekananda Global University. My work spans intelligent web applications,
									computer vision systems, and multi‑agent AI architectures.
								</p>
								<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
									What genuinely excites me: building AI that feels invisible - privacy‑first,
									on‑device, purposeful. I&apos;ve published research on real‑time posture detection
									and keep pushing into the space where systems engineering meets human experience.
								</p>

								<div className="grid grid-cols-3 gap-3 mb-8 max-w-sm">
									{[
										{ v: "10+", l: "Projects" },
										{ v: "1", l: "Publication" },
										{ v: "2", l: "Internships" },
									].map((s) => (
										<div
											key={s.l}
											className="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-3 py-3 text-center"
										>
											<p className="text-lg font-bold text-gray-900 dark:text-white">{s.v}</p>
											<p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-0.5">
												{s.l}
											</p>
										</div>
									))}
								</div>

								<PrimaryLink href="/about">
									More about me <FontAwesomeIcon icon={faArrowRight} />
								</PrimaryLink>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Research teaser
   ───────────────────────────────────────────── */

const PAPER_AREAS = ["Computer Vision", "MediaPipe", "Pose Estimation", "Real-time Systems", "Human-Centered AI"];

function ResearchTeaser() {
	return (
		<SectionCard
			id="research-teaser"
			label="Research"
			heading="Published Work"
			lead="Peer-reviewed research at the intersection of computer vision and human health."
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ type: "spring", stiffness: 90, damping: 18 }}
				viewport={{ once: true, amount: 0.2 }}
				className="rounded-2xl border border-amber-100 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] p-6 sm:p-8"
			>
				<div className="flex flex-wrap items-center gap-3 mb-5">
					<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-full">
						Published · 2024
					</span>
					<span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
						Peer-Reviewed
					</span>
				</div>
				<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
					PostureSense: Real-Time Posture Detection and Correction Using MediaPipe and Computer Vision
				</h3>
				<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-5">
					A real-time posture monitoring system using MediaPipe pose landmarks and computer vision - providing corrective feedback via webcam with no wearables required.
				</p>
				<div className="flex flex-wrap gap-2 mb-6">
					{PAPER_AREAS.map((area) => (
						<span key={area} className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300">
							{area}
						</span>
					))}
				</div>
				<div className="flex flex-wrap gap-3">
					<PrimaryLink href="/research">
						View research <FontAwesomeIcon icon={faArrowRight} />
					</PrimaryLink>
					<SecondaryLink href="/projects/posturesense">
						See project
					</SecondaryLink>
				</div>
			</motion.div>
		</SectionCard>
	);
}

/* ─────────────────────────────────────────────
   Currently Building section
   ───────────────────────────────────────────── */

const EXPLORATIONS = [
	{ label: "Privacy-first AI Companion", desc: "On-device LLM for personal use - no cloud dependency, no data exposure." },
	{ label: "Multi-agent Orchestration", desc: "Autonomous agent pipelines with tool use, memory, and emergent reasoning." },
	{ label: "Human-centered AI Interfaces", desc: "Interfaces that feel like a collaborator - not a tool." },
	{ label: "Real-time Vision Systems", desc: "Low-latency computer vision for health, accessibility, and everyday use." },
];

function CurrentlyBuildingSection() {
	return (
		<section id="building" className="py-20 md:py-28 bg-transparent">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<motion.div
					className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-14 border border-amber-200/50 bg-gradient-to-br from-[#FFFBEB] to-[#FAFAF9] shadow-[0_16px_48px_-16px_rgba(245,158,11,0.20)]"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", stiffness: 80, damping: 20 }}
					viewport={{ once: true, amount: 0.2 }}
				>
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
						<div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-stone-200/50 blur-3xl" />
					</div>

					<div className="relative">
						<div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
							<div>
								<span className="inline-block text-[10px] font-bold uppercase tracking-[.35rem] text-amber-700 bg-amber-100/80 border border-amber-200/60 px-3 py-1.5 rounded-full mb-4">In progress</span>
								<h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
									Currently Building.
								</h2>
							</div>
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
							</span>
						</div>
						<p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
							Not everything ships at once. These are the directions I&apos;m actively exploring - some are side projects, some are experiments, all are intentional.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{EXPLORATIONS.map((item, i) => (
								<motion.div
									key={item.label}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.07, type: "spring", stiffness: 90, damping: 18 }}
									viewport={{ once: true, amount: 0.2 }}
									className="rounded-2xl border border-amber-100 bg-white/70 backdrop-blur-sm p-5 hover:bg-white/90 hover:border-amber-200 transition"
								>
									<div className="flex items-center gap-2 mb-2">
										<span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
										<h3 className="text-sm font-semibold text-gray-900">{item.label}</h3>
									</div>
									<p className="text-gray-500 text-sm leading-relaxed pl-4">{item.desc}</p>
								</motion.div>
							))}
						</div>

						<div className="mt-10">
							<Link
								href="/now"
								className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
							>
								See the full /now page <FontAwesomeIcon icon={faArrowRight} />
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Live section (GitHub activity + /now teaser)
   ───────────────────────────────────────────── */

function NowTeaser() {
	const [now, setNow] = useState(null);

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/now")
			.then((res) => mounted && setNow(res.data || {}))
			.catch(() => mounted && setNow({}));
		return () => {
			mounted = false;
		};
	}, []);

	const items = [
		{ label: "Focus", value: now?.focus, fallback: "Building polished portfolio + side projects." },
		{ label: "Learning", value: now?.learning, fallback: "Generative AI tooling & system design." },
		{ label: "Reading", value: now?.reading, fallback: "Designing Data‑Intensive Applications." },
	].map((x) => ({ ...x, value: x.value || x.fallback }));

	return (
		<div className="rounded-2xl border border-white/70 dark:border-white/10 bg-white/55 dark:bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(245,158,11,0.10)] dark:shadow-sm h-full">
			<div className="flex items-center justify-between gap-3 mb-5">
				<div>
					<h3 className="text-sm font-semibold text-gray-900 dark:text-white">What I&apos;m up to now</h3>
					<p className="text-[11px] text-gray-500 dark:text-gray-400">A snapshot, refreshed whenever life shifts.</p>
				</div>
				<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 px-2 py-1 rounded-full">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
				</span>
			</div>

			<dl className="space-y-4">
				{items.map((it) => (
					<div key={it.label}>
						<dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
							{it.label}
						</dt>
						<dd className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{it.value}</dd>
					</div>
				))}
			</dl>

			<Link
				href="/now"
				className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
			>
				Read the full /now page <FontAwesomeIcon icon={faArrowRight} />
			</Link>
		</div>
	);
}

function LiveSection() {
	return (
		<section id="live" className="py-20 md:py-28 bg-transparent">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", stiffness: 90, damping: 18 }}
					viewport={{ once: true, amount: 0.2 }}
					className="mb-10 max-w-2xl"
				>
					<SectionLabel>Live signals</SectionLabel>
					<h2 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
						What&apos;s happening, right now.
					</h2>
					<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
						The static parts of a portfolio age fast. These two panels stay current - pulled
						from GitHub and a hand‑written /now page.
					</p>
				</motion.div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<GithubActivity />
					<NowTeaser />
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Contact CTA
   ───────────────────────────────────────────── */

function ContactCTA() {
	return (
		<section id="contact-cta" className="py-20 md:py-28 bg-transparent">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<motion.div
					className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-16 border border-amber-200/50 bg-gradient-to-br from-[#FFFBEB] via-[#FFF8E7] to-[#FAFAF9] shadow-[0_16px_48px_-16px_rgba(245,158,11,0.22)]"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", stiffness: 80, damping: 20 }}
					viewport={{ once: true, amount: 0.2 }}
				>
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />
						<div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-stone-200/60 blur-3xl" />
					</div>

					<div className="relative max-w-3xl">
						<span className="inline-block text-[10px] font-bold uppercase tracking-[.35rem] text-amber-700 bg-amber-100/80 border border-amber-200/60 px-3 py-1.5 rounded-full mb-5">
							Let&apos;s connect
						</span>
						<h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
							Have a project in mind, or just want to say hi?
						</h2>
						<p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8">
							I&apos;m always open to interesting collaborations, freelance opportunities, and
							thoughtful conversations about the web, AI, and great software.
						</p>
						<div className="flex flex-wrap gap-3">
							<Link
								href="/contact"
								className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm"
							>
								<FontAwesomeIcon icon={faPaperPlane} /> Send a message
							</Link>
							<a
								href="https://github.com/vedaangsharma"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-amber-200 text-gray-700 text-sm font-semibold hover:bg-amber-50 transition"
							>
								<FontAwesomeIcon icon={faArrowUpRightFromSquare} /> GitHub
							</a>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

export default function MyPage() {
	const [settings, setSettings] = useState(null);

	useEffect(() => {
		let isMounted = true;
		fetchJson("/api/settings")
			.then((res) => {
				if (!isMounted) return;
				setSettings(res.data || {});
			})
			.catch(() => {});
		return () => {
			isMounted = false;
		};
	}, []);

	const fullName = settings?.full_name || "Vedaang Sharma";
	const tagline = settings?.tagline || "Full Stack & AI Systems Developer";
	const heroSubtitle =
		settings?.hero_subtitle ||
		"Building intelligent applications - AI agents, distributed systems, computer vision, and cloud-native architectures. CS student, published researcher, full-stack engineer.";
	const cvUrl = settings?.resume_pdf_url || settings?.cv_url || "/docs/cv.pdf";

	return (
		<main className="bg-transparent overflow-hidden">
			<TerminalIntro />
			<HeroSection
				fullName={fullName}
				tagline={tagline}
				heroSubtitle={heroSubtitle}
				cvUrl={cvUrl}
			/>
			<SkillsPreview />
			<FeaturedProjectsPreview />
			<ResearchTeaser />
			<CurrentlyBuildingSection />
			<LiveSection />
			<AboutPreview />
			<ContactCTA />
		</main>
	);
}
