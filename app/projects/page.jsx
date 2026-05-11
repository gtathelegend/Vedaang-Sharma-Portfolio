"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchJson } from "@/lib/api";
import ProjectAll from "@/public/image/projects.jpg";
import ProjectCard from "./components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
	const [activeCategory, setActiveCategory] = useState(null);
	const [projects, setProjects] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const visibleProjects = projects.filter((item) => item.show === true && item.status !== "draft");

	useEffect(() => { window.scrollTo(0, 0); }, []);

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			try {
				const [projRes, catRes] = await Promise.all([fetchJson("/api/projects"), fetchJson("/api/categories")]);
				if (isMounted) { setProjects(projRes.data || []); setCategories(catRes.data || []); setError(""); }
			} catch {
				if (isMounted) setError("Unable to load projects right now.");
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};
		loadData();
		return () => { isMounted = false; };
	}, []);

	return (
		<main className="overflow-hidden bg-transparent">
			{/* Hero */}
			<section className="relative min-h-[100svh] md:h-screen flex justify-center items-center overflow-hidden pt-24 md:pt-0 pb-12 md:pb-0">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-blue-50 dark:bg-blue-500/10 blur-3xl opacity-60" />
				</div>
				<motion.div className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}>
					<div className="relative h-full w-full transition-all duration-700">
						<Image src={ProjectAll} alt="Projects" fill className="object-cover" placeholder="blur" sizes="(max-width: 768px) 0px, 40vw" />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent dark:from-gray-950 dark:via-gray-950/60" />
					</div>
				</motion.div>
				<div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-8">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
					</Link>
					<div className="md:max-w-[58%] lg:max-w-[52%]">
						<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 dark:text-gray-500 mb-3"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.05 }}>Portfolio</motion.p>
						<motion.h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.15 }}>My Projects</motion.h1>
						<motion.p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.25 }}>
							A collection of things I&apos;ve built and shipped - from full‑stack web apps to AI experiments.
						</motion.p>
						<motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.35 }}>
							<a href="#project-grid" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-sm">
								Browse projects <FontAwesomeIcon icon={faArrowRight} />
							</a>
						</motion.div>
					</div>
				</div>
			</section>

			{/* All projects */}
			<div id="project-grid" className="px-6 sm:px-8 md:px-16 py-12 md:py-16">
				<SectionHeader label="All Work" heading="All Projects" />

				{/* Category filter */}
				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ type: "spring" }} viewport={{ once: true }}
					className="flex flex-row justify-start items-start flex-wrap gap-2 sm:gap-3 my-6 md:my-8">
					<button
						className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 ${
							activeCategory === null ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
						}`}
						onClick={() => setActiveCategory(null)}>All</button>
					{categories.map((cat) => (
						<button key={cat.id}
							className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 ${
								activeCategory === cat.id ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
							}`}
							onClick={() => setActiveCategory(cat.id)}>{cat.name}</button>
					))}
				</motion.div>

				{/* Project grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
					{isLoading && <div className="text-gray-500">Loading projects...</div>}
					{!isLoading && error && <div className="text-red-600">{error}</div>}
					{!isLoading && !error && visibleProjects.map((project) => (
						<ProjectCard project={project} key={project.id || project._id || project.slug} activeCategory={activeCategory} />
					))}
					{!isLoading && !error && visibleProjects.length === 0 && (
						<p className="text-gray-500 col-span-2 text-center py-10">No projects to show yet.</p>
					)}
				</div>
			</div>
		</main>
	);
}
