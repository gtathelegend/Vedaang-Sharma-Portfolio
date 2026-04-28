"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const CATEGORY_META = {
	frontend: { title: "Frontend", icon: CodepenIcon, description: "Modern, responsive web interfaces" },
	backend: { title: "Backend / API", icon: WebhookIcon, description: "Robust and scalable server‑side services" },
	ai: { title: "AI & ML", icon: ActivityIcon, description: "Intelligent solutions with ML and LLMs" },
	mobile: { title: "Mobile", icon: MobileIcon, description: "Cross‑platform mobile experiences" },
	devops: { title: "DevOps", icon: CloudIcon, description: "CI/CD, containers, cloud infrastructure" },
	database: { title: "Databases", icon: DatabaseIcon, description: "Relational and NoSQL data stores" },
	other: { title: "Other", icon: ToolsIcon, description: "Tools, platforms, and extras" },
};

const LEVEL_STYLE = {
	expert: "bg-emerald-100 text-emerald-700",
	advanced: "bg-blue-100 text-blue-700",
	intermediate: "bg-amber-100 text-amber-700",
	beginner: "bg-gray-100 text-gray-600",
};

function CategoryCard({ k, meta, isSelected, onClick, count }) {
	const Icon = meta.icon;
	return (
		<motion.button
			type="button"
			onClick={onClick}
			whileHover={{ y: -2 }}
			whileTap={{ scale: 0.98 }}
			className={`text-left rounded-2xl border p-5 transition w-full ${
				isSelected
					? "bg-gray-900 text-white border-gray-900 shadow-lg"
					: "bg-white border-gray-100 hover:border-gray-300 hover:shadow-md"
			}`}
		>
			<div className="flex items-center gap-3 mb-2">
				<div
					className={`w-10 h-10 rounded-xl flex items-center justify-center ${
						isSelected ? "bg-white/15" : "bg-gray-100"
					}`}
				>
					<Icon className="w-5 h-5" />
				</div>
				<div className="flex-1">
					<h3 className="text-base font-semibold">{meta.title}</h3>
					<p className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
						{count} {count === 1 ? "skill" : "skills"}
					</p>
				</div>
			</div>
			<p className={`text-sm leading-relaxed ${isSelected ? "text-gray-300" : "text-gray-600"}`}>
				{meta.description}
			</p>
		</motion.button>
	);
}

export default function SkillsPage() {
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
		return () => {
			mounted = false;
		};
	}, []);

	const categories = skillsByCategory
		? Object.keys(skillsByCategory).filter((k) => (skillsByCategory[k] || []).length > 0)
		: [];

	const meta = (selected && CATEGORY_META[selected]) || {
		title: selected || "",
		description: "",
		icon: ActivityIcon,
	};
	const skills = (selected && skillsByCategory?.[selected]) || [];

	return (
		<main className="min-h-screen bg-white dark:bg-gray-950">
			{/* Hero */}
			<section className="relative pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-blue-50 blur-3xl opacity-60" />
				</div>

				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-8"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
					</Link>

					<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3">
						My toolkit
					</p>
					<h1 className="text-gray-900 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight max-w-3xl mb-5">
						Skills, tools, and the stack I love.
					</h1>
					<p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl">
						Pick a category to dive into the specific technologies I use. I keep this list
						honest — only things I&apos;ve actually shipped or built with.
					</p>
				</div>
			</section>

			{/* Body */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					{error && <p className="text-red-500 mb-6">{error}</p>}

					{skillsByCategory === null ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-32 rounded-2xl bg-gray-100" />
							))}
						</div>
					) : categories.length === 0 ? (
						<p className="text-gray-500 italic">No skills added yet.</p>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
								{categories.map((k, i) => {
									const m = CATEGORY_META[k] || {
										title: k,
										description: "",
										icon: ActivityIcon,
									};
									return (
										<motion.div
											key={k}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.05 }}
										>
											<CategoryCard
												k={k}
												meta={m}
												isSelected={selected === k}
												onClick={() => setSelected(k)}
												count={(skillsByCategory[k] || []).length}
											/>
										</motion.div>
									);
								})}
							</div>

							<AnimatePresence mode="wait">
								{selected && (
									<motion.div
										key={selected}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -16 }}
										transition={{ duration: 0.25 }}
										className="rounded-3xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/60 shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.08)] p-8 sm:p-10"
									>
										<div className="flex flex-wrap items-end justify-between gap-3 mb-6">
											<div>
												<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
													{meta.title}
												</h2>
												<p className="text-sm text-gray-500 mt-1">{meta.description}</p>
											</div>
											<span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
												{skills.length} {skills.length === 1 ? "skill" : "skills"}
											</span>
										</div>

										<div className="flex flex-wrap gap-2">
											{skills.map((s) => (
												<span
													key={s.name}
													className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 shadow-sm"
												>
													{s.name}
													{s.level && (
														<span
															className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${
																LEVEL_STYLE[s.level] || LEVEL_STYLE.beginner
															}`}
														>
															{s.level}
														</span>
													)}
												</span>
											))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							<div className="mt-12 flex flex-wrap gap-3">
								<Link
									href="/projects"
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm"
								>
									See these in action <FontAwesomeIcon icon={faArrowRight} />
								</Link>
								<Link
									href="/contact"
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
								>
									Have a project? Let&apos;s talk
								</Link>
							</div>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
