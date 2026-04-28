"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchJson } from "@/lib/api";
import ProjectAll from "@/public/image/projects.jpg";
import BlurImage from "@/public/image/placeholder/blur.jpg";
import ProjectCard from "./components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowUpRightFromSquare, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function FeaturedHighlight({ project }) {
	if (!project) return null;
	const images = project.images?.length ? project.images : [];
	const thumbnail = project.thumbnail || project.imageUrl || BlurImage.src;
	const desc = project.desc || project.description || [];
	const tech = project.tech || project.techStack || [];
	const displayImages = [images[0] || thumbnail, images[1] || thumbnail, images[2] || thumbnail];
	const githubUrl = project.githubLink || project.code;
	const liveUrl = project.liveLink || project.preview;

	return (
		<div className="py-12 md:py-16 px-6 sm:px-8 md:px-16">
			<SectionHeader label="Featured" heading="Highlight" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
				<div className="flex justify-center items-start flex-col">
					<div className="images relative w-full aspect-square">
						{displayImages.map((img, i) => (
							<div key={i} className={`absolute ${i === 0 ? "top-[20%] left-[10%] h-[40%]" : i === 1 ? "bottom-[10%] md:bottom-[15%] right-[15%] h-[35%]" : "top-[10%] right-[20%] h-[30%]"} aspect-video grayscale hover:grayscale-0 transition-all ease duration-300 hover:scale-110 hover:z-20`}>
								<motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 }} viewport={{ once: true }} className="w-full h-full shadow-lg rounded-lg overflow-hidden relative">
									<Image src={img} alt={project.title} fill sizes="300px" className="object-cover" blurDataURL={BlurImage.src} placeholder="blur" />
								</motion.div>
							</div>
						))}
					</div>
				</div>
				<motion.div className="flex justify-center items-start flex-col md:px-10" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: "spring" }} viewport={{ once: true }}>
					<h2 className="text-xl sm:text-2xl font-bold tracking-wider mb-3 text-gray-900">{project.title}</h2>
					{tech.length > 0 && <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{tech.join(" · ")}</p>}
					<p className="text-gray-600 text-justify text-sm sm:text-base leading-relaxed">{desc[0] || ""}</p>
					<div className="mt-4 flex flex-wrap gap-3">
						<Link href={`/projects/${project.slug}`} className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">More</Link>
						{liveUrl && (
							<a href={liveUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition inline-flex items-center gap-2">
								Preview <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
							</a>
						)}
						{githubUrl && (
							<a href={githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition inline-flex items-center gap-2">
								GitHub <FontAwesomeIcon icon={faGithub} className="text-sm" />
							</a>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default function Page() {
	const [activeCategory, setActiveCategory] = useState(null);
	const [projects, setProjects] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const visibleProjects = projects.filter((item) => item.show === true && item.status !== "draft" && item.status !== "archived");
	const featuredProject = visibleProjects.find((p) => p.featured);
	const gridProjects = visibleProjects.filter((p) => !p.featured);

	useEffect(() => { window.scrollTo(0, 0); }, []);

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			try {
				const [projRes, catRes] = await Promise.all([fetchJson("/api/projects"), fetchJson("/api/categories")]);
				if (isMounted) { setProjects(projRes.data || []); setCategories(catRes.data || []); setError(""); }
			} catch (err) {
				if (isMounted) setError("Unable to load projects right now.");
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};
		loadData();
		return () => { isMounted = false; };
	}, []);

	return (
		<main className="overflow-hidden bg-white dark:bg-gray-950">
			{/* Hero */}
			<section className="relative min-h-[100svh] md:h-screen flex justify-center items-center overflow-hidden pt-24 md:pt-0 pb-12 md:pb-0">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-blue-50 blur-3xl opacity-60" />
				</div>
				<motion.div className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}>
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={ProjectAll} alt="Projects" fill className="object-cover" placeholder="blur" sizes="(max-width: 768px) 0px, 40vw" />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
					</div>
				</motion.div>
				<div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-8">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
					</Link>
					<div className="md:max-w-[58%] lg:max-w-[52%]">
						<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.05 }}>Portfolio</motion.p>
						<motion.h1 className="text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.15 }}>My Projects</motion.h1>
						<motion.p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.25 }}>
							A collection of things I&apos;ve built and shipped — from full‑stack web apps to AI experiments.
						</motion.p>
						<motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.35 }}>
							<a href="#project-grid" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
								Browse projects <FontAwesomeIcon icon={faArrowRight} />
							</a>
							<Link href="/projects/archive" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
								View archive
							</Link>
						</motion.div>
					</div>
				</div>
			</section>

			{!isLoading && !error && <FeaturedHighlight project={featuredProject} />}

			{/* All projects */}
			<div id="project-grid" className="px-6 sm:px-8 md:px-16 py-12 md:py-16">
				<SectionHeader label="All Work" heading={featuredProject ? "Other Note Worthy Projects" : "All Projects"} />

				{/* Category filter */}
				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ type: "spring" }} viewport={{ once: true }}
					className="flex flex-row justify-start items-start flex-wrap gap-2 sm:gap-3 my-6 md:my-8">
					<button
						className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 ${
							activeCategory === null ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
						onClick={() => setActiveCategory(null)}>All</button>
					{categories.map((cat) => (
						<button key={cat.id}
							className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 ${
								activeCategory === cat.id ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
							}`}
							onClick={() => setActiveCategory(cat.id)}>{cat.name}</button>
					))}
				</motion.div>

				{/* Project grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
					{isLoading && <div className="text-gray-500">Loading projects...</div>}
					{!isLoading && error && <div className="text-red-600">{error}</div>}
					{!isLoading && !error && (featuredProject ? gridProjects : visibleProjects).map((project) => (
						<ProjectCard project={project} key={project.id || project._id || project.slug} activeCategory={activeCategory} />
					))}
					{!isLoading && !error && visibleProjects.length === 0 && (
						<p className="text-gray-500 col-span-2 text-center py-10">No projects to show yet.</p>
					)}
				</div>

				{/* Archive link */}
				<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center items-center mt-12">
					<Link href="/projects/archive" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
						View In Archive
					</Link>
				</motion.div>
			</div>
		</main>
	);
}
