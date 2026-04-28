"use client";

import { useEffect, useRef, useState } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
	useMotionValue,
	useInView,
	animate,
} from "framer-motion";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faArrowRight,
	faLayerGroup,
	faBolt,
	faStar,
	faCode,
} from "@fortawesome/free-solid-svg-icons";
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
   Category metadata + color theming
   ───────────────────────────────────────────── */

const CATEGORY_META = {
	frontend: { title: "Frontend",     icon: CodepenIcon,  description: "Modern, responsive web interfaces" },
	backend:  { title: "Backend / API", icon: WebhookIcon,  description: "Robust, scalable server-side services" },
	ai:       { title: "AI & ML",       icon: ActivityIcon, description: "Intelligent solutions with ML and LLMs" },
	mobile:   { title: "Mobile",        icon: MobileIcon,   description: "Cross-platform mobile experiences" },
	devops:   { title: "DevOps",        icon: CloudIcon,    description: "CI/CD, containers, cloud infrastructure" },
	database: { title: "Databases",     icon: DatabaseIcon, description: "Relational and NoSQL data stores" },
	other:    { title: "Other",         icon: ToolsIcon,    description: "Tools, platforms, and extras" },
};

// All class names below are LITERAL strings so Tailwind picks them up.
const CATEGORY_THEMES = {
	frontend: {
		grad: "from-blue-500 to-cyan-500",
		soft: "from-blue-50 to-cyan-50",
		softDark: "dark:from-blue-500/15 dark:to-cyan-500/15",
		text: "text-blue-600 dark:text-blue-400",
		ring: "shadow-blue-500/30",
		dot:  "bg-blue-500",
		hex:  "#3b82f6",
	},
	backend: {
		grad: "from-violet-500 to-purple-600",
		soft: "from-violet-50 to-purple-50",
		softDark: "dark:from-violet-500/15 dark:to-purple-500/15",
		text: "text-violet-600 dark:text-violet-400",
		ring: "shadow-violet-500/30",
		dot:  "bg-violet-500",
		hex:  "#8b5cf6",
	},
	ai: {
		grad: "from-pink-500 to-rose-500",
		soft: "from-pink-50 to-rose-50",
		softDark: "dark:from-pink-500/15 dark:to-rose-500/15",
		text: "text-pink-600 dark:text-pink-400",
		ring: "shadow-pink-500/30",
		dot:  "bg-pink-500",
		hex:  "#ec4899",
	},
	mobile: {
		grad: "from-emerald-500 to-teal-500",
		soft: "from-emerald-50 to-teal-50",
		softDark: "dark:from-emerald-500/15 dark:to-teal-500/15",
		text: "text-emerald-600 dark:text-emerald-400",
		ring: "shadow-emerald-500/30",
		dot:  "bg-emerald-500",
		hex:  "#10b981",
	},
	devops: {
		grad: "from-orange-500 to-amber-500",
		soft: "from-orange-50 to-amber-50",
		softDark: "dark:from-orange-500/15 dark:to-amber-500/15",
		text: "text-orange-600 dark:text-orange-400",
		ring: "shadow-orange-500/30",
		dot:  "bg-orange-500",
		hex:  "#f97316",
	},
	database: {
		grad: "from-indigo-500 to-blue-600",
		soft: "from-indigo-50 to-blue-50",
		softDark: "dark:from-indigo-500/15 dark:to-blue-500/15",
		text: "text-indigo-600 dark:text-indigo-400",
		ring: "shadow-indigo-500/30",
		dot:  "bg-indigo-500",
		hex:  "#6366f1",
	},
	other: {
		grad: "from-slate-500 to-gray-600",
		soft: "from-slate-50 to-gray-100",
		softDark: "dark:from-slate-500/15 dark:to-gray-500/15",
		text: "text-slate-600 dark:text-slate-400",
		ring: "shadow-slate-500/30",
		dot:  "bg-slate-500",
		hex:  "#64748b",
	},
};

const themeFor = (k) => CATEGORY_THEMES[k] || CATEGORY_THEMES.other;
const metaFor  = (k) => CATEGORY_META[k]   || { title: k, description: "", icon: ActivityIcon };

const LEVEL_DOTS = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };

/* ─────────────────────────────────────────────
   Animated count-up
   ───────────────────────────────────────────── */

function CountUp({ to, duration = 1.4 }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-50px" });
	const count = useMotionValue(0);
	const [display, setDisplay] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const controls = animate(count, to, {
			duration,
			ease: "easeOut",
			onUpdate: (v) => setDisplay(Math.round(v)),
		});
		return () => controls.stop();
	}, [inView, to, duration, count]);

	return <span ref={ref}>{display}</span>;
}

/* ─────────────────────────────────────────────
   Floating decorative skill badges (hero)
   ───────────────────────────────────────────── */

function FloatingBadge({ label, color, x, y, delay }) {
	return (
		<motion.div
			className="hidden md:flex absolute items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg"
			style={{ left: x, top: y, backgroundColor: color }}
			initial={{ opacity: 0, scale: 0.6 }}
			animate={{ opacity: 0.95, scale: 1, y: ["0%", "-12%", "0%"] }}
			transition={{
				opacity: { duration: 0.6, delay },
				scale:   { duration: 0.6, delay, type: "spring" },
				y:       { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
			}}
		>
			<span className="w-1.5 h-1.5 rounded-full bg-white/80" />
			{label}
		</motion.div>
	);
}

/* ─────────────────────────────────────────────
   Stat card
   ───────────────────────────────────────────── */

function StatCard({ icon, value, label, theme, delay }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ delay, type: "spring", stiffness: 90, damping: 18 }}
			className="group relative rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 overflow-hidden hover:border-transparent transition"
		>
			<div
				className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${theme.soft} ${theme.softDark} transition-opacity duration-500`}
			/>
			<div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.grad} flex items-center justify-center text-white shadow-lg ${theme.ring} mb-4`}>
				<FontAwesomeIcon icon={icon} className="text-base" />
			</div>
			<div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
				<CountUp to={value} />+
			</div>
			<p className="text-[11px] mt-1 font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
				{label}
			</p>
		</motion.div>
	);
}

/* ─────────────────────────────────────────────
   Category card (vibrant + animated)
   ───────────────────────────────────────────── */

function CategoryCard({ k, isSelected, onClick, count, index }) {
	const meta = metaFor(k);
	const theme = themeFor(k);
	const Icon = meta.icon;

	return (
		<motion.button
			type="button"
			onClick={onClick}
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ delay: index * 0.06, type: "spring", stiffness: 90, damping: 18 }}
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.98 }}
			className={`group relative text-left rounded-2xl p-6 w-full overflow-hidden transition-all duration-300 ${
				isSelected
					? `bg-gradient-to-br ${theme.grad} text-white shadow-xl ${theme.ring}`
					: "bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 hover:border-transparent hover:shadow-xl"
			}`}
		>
			{/* Soft tint on hover when not selected */}
			{!isSelected && (
				<div
					className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${theme.soft} ${theme.softDark} transition-opacity duration-500`}
				/>
			)}

			{/* Glow orb that grows on hover */}
			<div
				className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-50"
				style={{ backgroundColor: theme.hex }}
			/>

			<div className="relative flex items-start gap-3 mb-3">
				<div
					className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
						isSelected ? "bg-white/20 text-white" : "bg-gradient-to-br text-white shadow-md " + theme.grad
					}`}
				>
					<Icon className="w-5 h-5" />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-base font-bold leading-tight">{meta.title}</h3>
					<p className={`text-[11px] mt-0.5 font-semibold uppercase tracking-widest ${
						isSelected ? "text-white/70" : "text-gray-400 dark:text-gray-500"
					}`}>
						{count} {count === 1 ? "skill" : "skills"}
					</p>
				</div>
			</div>

			<p className={`relative text-sm leading-relaxed ${
				isSelected ? "text-white/90" : "text-gray-600 dark:text-gray-400"
			}`}>
				{meta.description}
			</p>

			<div className={`relative mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${
				isSelected ? "text-white" : theme.text
			}`}>
				{isSelected ? "Viewing" : "Explore"}
				<FontAwesomeIcon icon={faArrowRight} className="text-[10px] transition-transform group-hover:translate-x-1" />
			</div>
		</motion.button>
	);
}

/* ─────────────────────────────────────────────
   Skill tile (level dots, hover lift)
   ───────────────────────────────────────────── */

function SkillTile({ skill, theme, index }) {
	const filledDots = LEVEL_DOTS[skill.level] || 0;
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.92 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ delay: index * 0.035, type: "spring", stiffness: 110, damping: 16 }}
			whileHover={{ y: -3, scale: 1.03 }}
			className="group relative rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-3 overflow-hidden"
		>
			<div
				className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${theme.soft} ${theme.softDark} transition-opacity duration-300`}
			/>
			<div
				className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
				style={{ backgroundColor: theme.hex }}
			/>
			<div className="flex items-center justify-between gap-3">
				<span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
					{skill.name}
				</span>
				{filledDots > 0 && (
					<div className="flex items-center gap-0.5 shrink-0">
						{[1, 2, 3, 4].map((n) => (
							<span
								key={n}
								className="w-1.5 h-1.5 rounded-full transition-colors"
								style={{
									backgroundColor: n <= filledDots ? theme.hex : undefined,
								}}
							>
								{n > filledDots && (
									<span className="block w-full h-full rounded-full bg-gray-200 dark:bg-white/10" />
								)}
							</span>
						))}
					</div>
				)}
			</div>
			{skill.level && (
				<p className={`text-[10px] mt-1 font-semibold uppercase tracking-widest capitalize ${theme.text}`}>
					{skill.level}
				</p>
			)}
		</motion.div>
	);
}

/* ─────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────── */

export default function SkillsPage() {
	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});

	// Parallax transforms — orbs move at different rates
	const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
	const orb1X = useTransform(scrollYProgress, [0, 1], [0, 60]);
	const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 220]);
	const orb2X = useTransform(scrollYProgress, [0, 1], [0, -80]);
	const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
	const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 80]);
	const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

	const [skillsByCategory, setSkillsByCategory] = useState(null);
	const [selected, setSelected] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		let mounted = true;
		fetchJson("/api/skills")
			.then((res) => {
				if (!mounted) return;
				const data = res.data || {};
				setSkillsByCategory(data);
				const firstWith = Object.keys(data).find((k) => (data[k] || []).length > 0);
				setSelected(firstWith || null);
			})
			.catch(() => mounted && setError("Failed to load skills."));
		return () => { mounted = false; };
	}, []);

	const categories = skillsByCategory
		? Object.keys(skillsByCategory).filter((k) => (skillsByCategory[k] || []).length > 0)
		: [];

	const allSkills = skillsByCategory
		? Object.values(skillsByCategory).flat()
		: [];
	const expertCount = allSkills.filter((s) => s.level === "expert" || s.level === "advanced").length;

	const meta = metaFor(selected);
	const skills = (selected && skillsByCategory?.[selected]) || [];
	const theme = themeFor(selected);

	return (
		<main className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">

			{/* ───────── Hero with parallax ───────── */}
			<section
				ref={heroRef}
				className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden"
			>
				{/* Parallax orbs */}
				<motion.div
					style={{ y: orb1Y, x: orb1X }}
					className="pointer-events-none absolute -top-24 left-[8%] h-80 w-80 rounded-full bg-blue-200 dark:bg-blue-500/20 blur-3xl opacity-50"
				/>
				<motion.div
					style={{ y: orb2Y, x: orb2X }}
					className="pointer-events-none absolute top-32 right-[5%] h-96 w-96 rounded-full bg-violet-200 dark:bg-violet-500/20 blur-3xl opacity-40"
				/>
				<motion.div
					style={{ y: orb3Y }}
					className="pointer-events-none absolute -top-16 right-1/3 h-60 w-60 rounded-full bg-pink-200 dark:bg-pink-500/15 blur-3xl opacity-50"
				/>

				{/* Floating skill badges */}
				<FloatingBadge label="React"  color="#3b82f6" x="14%" y="34%" delay={0.4} />
				<FloatingBadge label="Python" color="#10b981" x="78%" y="58%" delay={0.7} />
				<FloatingBadge label="Next.js" color="#8b5cf6" x="68%" y="28%" delay={1.0} />
				<FloatingBadge label="AI/ML" color="#ec4899" x="20%" y="68%" delay={1.3} />

				<motion.div
					style={{ y: heroTextY, opacity: heroOpacity }}
					className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16"
				>
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-10"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" /> Back home
					</Link>

					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.35rem] mb-4"
					>
						<span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
							My toolkit
						</span>
					</motion.p>

					<motion.h1
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.18, type: "spring", stiffness: 80, damping: 18 }}
						className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl mb-6"
					>
						Skills, tools, and the{" "}
						<span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
							stack I love
						</span>
						.
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl"
					>
						Pick a category to dive into the specific technologies I use. I keep this list
						honest — only things I&apos;ve actually shipped or built with.
					</motion.p>
				</motion.div>
			</section>

			{/* ───────── Stats strip ───────── */}
			{skillsByCategory && allSkills.length > 0 && (
				<section className="relative -mt-8 md:-mt-12 z-10 mb-12 md:mb-20">
					<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<StatCard icon={faCode}        value={allSkills.length}    label="Total skills"      theme={CATEGORY_THEMES.frontend} delay={0.0} />
							<StatCard icon={faLayerGroup}  value={categories.length}    label="Categories"        theme={CATEGORY_THEMES.backend}  delay={0.08} />
							<StatCard icon={faStar}        value={expertCount}          label="Advanced+"         theme={CATEGORY_THEMES.ai}       delay={0.16} />
							<StatCard icon={faBolt}        value={3}                    label="Years experience"  theme={CATEGORY_THEMES.devops}   delay={0.24} />
						</div>
					</div>
				</section>
			)}

			{/* ───────── Body ───────── */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

					{error && <p className="text-red-500 mb-6">{error}</p>}

					{skillsByCategory === null ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-white/5" />
							))}
						</div>
					) : categories.length === 0 ? (
						<p className="text-gray-500 italic">No skills added yet.</p>
					) : (
						<>
							{/* Section heading */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.5 }}
								transition={{ type: "spring", stiffness: 90, damping: 18 }}
								className="mb-8"
							>
								<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 dark:text-gray-500 mb-2">
									Browse by area
								</p>
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
									Pick a category
								</h2>
							</motion.div>

							{/* Category grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
								{categories.map((k, i) => (
									<CategoryCard
										key={k}
										k={k}
										isSelected={selected === k}
										onClick={() => setSelected(k)}
										count={(skillsByCategory[k] || []).length}
										index={i}
									/>
								))}
							</div>

							{/* Selected detail panel */}
							<AnimatePresence mode="wait">
								{selected && (
									<motion.div
										key={selected}
										initial={{ opacity: 0, y: 24 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -16 }}
										transition={{ type: "spring", stiffness: 90, damping: 18 }}
										className="relative rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03]"
									>
										{/* Gradient header */}
										<div className={`relative bg-gradient-to-br ${theme.grad} px-8 sm:px-10 py-8 overflow-hidden`}>
											<div className="pointer-events-none absolute inset-0">
												<div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
												<div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
											</div>
											<div className="relative flex flex-wrap items-end justify-between gap-4">
												<div className="flex items-center gap-4">
													<div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
														<meta.icon className="w-7 h-7" />
													</div>
													<div>
														<h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
															{meta.title}
														</h2>
														<p className="text-sm text-white/85 mt-1">{meta.description}</p>
													</div>
												</div>
												<span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white uppercase tracking-widest">
													<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
													{skills.length} {skills.length === 1 ? "skill" : "skills"}
												</span>
											</div>
										</div>

										{/* Skill tiles */}
										<div className="p-6 sm:p-8">
											<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
												{skills.map((s, i) => (
													<SkillTile key={s.name} skill={s} theme={theme} index={i} />
												))}
											</div>

											{/* Level legend */}
											<div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
												<span>Proficiency:</span>
												{["beginner", "intermediate", "advanced", "expert"].map((lvl) => (
													<span key={lvl} className="inline-flex items-center gap-1.5">
														<span className="flex gap-0.5">
															{[1, 2, 3, 4].map((n) => (
																<span
																	key={n}
																	className="w-1.5 h-1.5 rounded-full"
																	style={{
																		backgroundColor:
																			n <= LEVEL_DOTS[lvl] ? theme.hex : undefined,
																	}}
																>
																	{n > LEVEL_DOTS[lvl] && (
																		<span className="block w-full h-full rounded-full bg-gray-200 dark:bg-white/10" />
																	)}
																</span>
															))}
														</span>
														<span className="capitalize">{lvl}</span>
													</span>
												))}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* CTA */}
							<motion.div
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ type: "spring", stiffness: 90, damping: 18 }}
								className="mt-16 relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-violet-900 to-blue-900 dark:from-gray-900 dark:via-violet-950 dark:to-blue-950 p-8 sm:p-12"
							>
								<div className="pointer-events-none absolute inset-0">
									<div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
									<div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
								</div>
								<div className="relative max-w-2xl">
									<h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
										See these in action.
									</h3>
									<p className="text-sm sm:text-base text-white/75 mb-6">
										Skills only mean something when applied — explore the projects where I&apos;ve put them to work.
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
