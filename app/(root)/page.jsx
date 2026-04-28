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
		<p className={`text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 dark:text-gray-500 mb-3 ${className}`}>
			{children}
		</p>
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
			className="relative isolate min-h-[100svh] flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-24 md:pt-0"
		>
			{/* Subtle background gradient orbs */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute top-1/4 -left-24 h-72 w-72 rounded-full bg-gray-100 dark:bg-white/5 blur-3xl opacity-70" />
				<div className="absolute bottom-1/4 -right-24 h-80 w-80 rounded-full bg-blue-50 dark:bg-blue-500/10 blur-3xl opacity-60" />
			</div>

			{/* Right portrait (desktop) */}
			<motion.div
				className="hidden md:block absolute top-0 right-0 h-full w-[42vw] -z-0"
				variants={slideRight}
				custom={0.1}
				initial="hidden"
				animate="visible"
			>
				<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
					<Image
						src={Me}
						fill
						className="object-cover object-top"
						alt={fullName}
						placeholder="blur"
						priority
						sizes="(max-width: 768px) 0px, 42vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent dark:from-gray-950 dark:via-gray-950/60" />
				</div>
			</motion.div>

			{/* Content */}
			<div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 py-12 md:py-0">
				<div className="md:max-w-[58%] lg:max-w-[52%]">
					{/* Mobile portrait pill */}
					<div className="flex md:hidden justify-center mb-8">
						<div className="w-32 h-32 rounded-full overflow-hidden grayscale ring-4 ring-white dark:ring-gray-900 shadow-xl">
							<Image
								src={Me}
								width={128}
								height={128}
								className="object-cover object-top w-full h-full"
								alt={fullName}
								placeholder="blur"
							/>
						</div>
					</div>

					<motion.div
						variants={slideLeft}
						custom={0.05}
						initial="hidden"
						animate="visible"
					>
						<SectionLabel>{fullName}</SectionLabel>
					</motion.div>

					<motion.h1
						className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
						variants={slideLeft}
						custom={0.15}
						initial="hidden"
						animate="visible"
					>
						{tagline}
					</motion.h1>

					<motion.p
						className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mb-10"
						variants={slideLeft}
						custom={0.28}
						initial="hidden"
						animate="visible"
					>
						{heroSubtitle}
					</motion.p>

					{/* Quick stats */}
					<motion.div
						className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mb-10"
						variants={fadeUp}
						custom={0.38}
						initial="hidden"
						animate="visible"
					>
						{[
							{ v: "10+", l: "Projects" },
							{ v: "5+", l: "Certifications" },
							{ v: "3+", l: "Years coding" },
						].map((s) => (
							<div
								key={s.l}
								className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-3 py-3 text-center shadow-sm"
							>
								<div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{s.v}</div>
								<div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
									{s.l}
								</div>
							</div>
						))}
					</motion.div>

					<motion.div
						className="flex flex-wrap gap-3"
						variants={fadeUp}
						custom={0.48}
						initial="hidden"
						animate="visible"
					>
						<PrimaryLink href={cvUrl} external>
							Download CV <FontAwesomeIcon icon={faArrowRight} />
						</PrimaryLink>
						<SecondaryLink href="/contact">Get in touch</SecondaryLink>
					</motion.div>
				</div>
			</div>

			{/* Scroll cue */}
			<motion.div
				className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2 }}
			>
				<span className="text-[10px] uppercase tracking-widest text-gray-400">scroll</span>
				<motion.div
					className="w-px h-8 bg-gray-300 origin-top"
					animate={{ scaleY: [0.3, 1, 0.3] }}
					transition={{ repeat: Infinity, duration: 1.6 }}
				/>
			</motion.div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   Section card wrapper — every section after hero
   ───────────────────────────────────────────── */

function SectionCard({ id, label, heading, lead, children }) {
	return (
		<section id={id} className="py-20 md:py-28 bg-white dark:bg-gray-950">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/40 shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.08)] dark:shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.6)] overflow-hidden">
					<div className="p-8 sm:p-10 md:p-14">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ type: "spring", stiffness: 90, damping: 18 }}
							viewport={{ once: true, amount: 0.2 }}
							className="mb-10 max-w-2xl"
						>
							<SectionLabel>{label}</SectionLabel>
							<h2 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
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
	frontend: { label: "Frontend", emoji: "🎨" },
	backend: { label: "Backend", emoji: "⚙️" },
	ai: { label: "AI / ML", emoji: "🧠" },
	mobile: { label: "Mobile", emoji: "📱" },
	devops: { label: "DevOps", emoji: "☁️" },
	database: { label: "Databases", emoji: "🗄️" },
	other: { label: "Other", emoji: "🛠️" },
};

function SkillsPreview() {
	const [skillsByCategory, setSkillsByCategory] = useState(null);

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/skills")
			.then((res) => mounted && setSkillsByCategory(res.data || {}))
			.catch(() => mounted && setSkillsByCategory({}));
		return () => {
			mounted = false;
		};
	}, []);

	const categories = skillsByCategory
		? Object.entries(skillsByCategory).filter(([, list]) => Array.isArray(list) && list.length > 0)
		: null;

	return (
		<SectionCard
			id="skills"
			label="What I do"
			heading="Skills & Technologies"
			lead="A snapshot of the stacks I work with day‑to‑day — from modern web frameworks to AI tooling and cloud infrastructure."
		>
			{categories === null ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-28 rounded-2xl bg-gray-100" />
					))}
				</div>
			) : categories.length === 0 ? (
				<p className="text-gray-500 italic">Skills coming soon.</p>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{categories.slice(0, 6).map(([key, list], i) => {
							const meta = SKILL_CATEGORY_META[key] || { label: key, emoji: "✨" };
							const top = list.slice(0, 4);
							return (
								<motion.div
									key={key}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.06, type: "spring", stiffness: 90, damping: 18 }}
									viewport={{ once: true, amount: 0.2 }}
									className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md transition"
								>
									<div className="flex items-center gap-3 mb-3">
										<div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-base">
											{meta.emoji}
										</div>
										<h3 className="text-base font-semibold text-gray-900 dark:text-white">{meta.label}</h3>
									</div>
									<div className="flex flex-wrap gap-1.5">
										{top.map((s) => (
											<span
												key={s.name}
												className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
											>
												{s.name}
											</span>
										))}
										{list.length > top.length && (
											<span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400"
											>
												+{list.length - top.length}
											</span>
										)}
									</div>
								</motion.div>
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
			lead="A few hand‑picked projects that show the kind of problems I enjoy solving — full‑stack, AI, and everything in between."
		>
			{projects === null ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="aspect-[4/3] rounded-2xl bg-gray-100" />
					))}
				</div>
			) : display.length === 0 ? (
				<p className="text-gray-500 italic">Projects are on the way.</p>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
									className="group rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] overflow-hidden hover:shadow-lg transition"
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
													{tech.slice(0, 3).map((t) => (
														<span
															key={t}
															className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
														>
															{t}
														</span>
													))}
													{tech.length > 3 && (
														<span className="text-[11px] font-medium px-2 py-0.5 rounded-md text-gray-400 dark:text-gray-500">
															+{tech.length - 3}
														</span>
													)}
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
		<section id="about" className="py-20 md:py-28 bg-white dark:bg-gray-950">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.08)] dark:shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.6)] overflow-hidden">
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
								className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
								placeholder="blur"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
						</motion.div>

						<div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ type: "spring", stiffness: 90, damping: 18 }}
								viewport={{ once: true, amount: 0.2 }}
							>
								<SectionLabel>About me</SectionLabel>
								<h2 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
									Building thoughtful, modern software.
								</h2>
								<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-5">
									I&apos;m a full‑stack developer based in Jaipur, India — currently studying Computer
									Science at Vivekananda Global University. I love turning ideas into clean,
									production‑ready apps that bridge web and AI.
								</p>
								<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
									When I&apos;m not coding, I&apos;m probably exploring new tools, writing about what I
									learn, or hunting for the perfect espresso.
								</p>

								<div className="grid grid-cols-3 gap-3 mb-8 max-w-sm">
									{[
										{ v: "3+", l: "Years coding" },
										{ v: "10+", l: "Projects" },
										{ v: "5+", l: "Stacks" },
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
		<div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm h-full">
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
		<section id="live" className="py-20 md:py-28 bg-white dark:bg-gray-950">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", stiffness: 90, damping: 18 }}
					viewport={{ once: true, amount: 0.2 }}
					className="mb-10 max-w-2xl"
				>
					<SectionLabel>Live signals</SectionLabel>
					<h2 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
						What&apos;s happening, right now.
					</h2>
					<p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
						The static parts of a portfolio age fast. These two panels stay current — pulled
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
		<section id="contact-cta" className="py-20 md:py-28 bg-white dark:bg-gray-950">
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
				<motion.div
					className="relative rounded-3xl bg-gray-900 text-white overflow-hidden p-10 sm:p-14 md:p-20"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", stiffness: 80, damping: 20 }}
					viewport={{ once: true, amount: 0.2 }}
				>
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
						<div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
					</div>

					<div className="relative max-w-3xl">
						<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3">
							Let&apos;s connect
						</p>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
							Have a project in mind, or just want to say hi?
						</h2>
						<p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
							I&apos;m always open to interesting collaborations, freelance opportunities, and
							thoughtful conversations about the web, AI, and great software.
						</p>
						<div className="flex flex-wrap gap-3">
							<Link
								href="/contact"
								className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition shadow-sm"
							>
								<FontAwesomeIcon icon={faPaperPlane} /> Send a message
							</Link>
							<a
								href="https://github.com/vedaangsharma"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition"
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
	const tagline = settings?.tagline || "Full Stack Developer";
	const heroSubtitle =
		settings?.hero_subtitle ||
		"Hi! I’m Vedaang Sharma, a full-stack developer specialising in modern web development with React, Node.js, and Next.js — and a growing focus on Artificial Intelligence.";
	const cvUrl = settings?.resume_pdf_url || settings?.cv_url || "/docs/cv.pdf";

	return (
		<main className="bg-white dark:bg-gray-950">
			<TerminalIntro />
			<HeroSection
				fullName={fullName}
				tagline={tagline}
				heroSubtitle={heroSubtitle}
				cvUrl={cvUrl}
			/>
			<SkillsPreview />
			<FeaturedProjectsPreview />
			<LiveSection />
			<AboutPreview />
			<ContactCTA />
		</main>
	);
}
