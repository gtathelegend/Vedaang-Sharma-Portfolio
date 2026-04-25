"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Image from "next/image";
import { fetchJson } from "@/lib/api";

import ProjectAll from "@/public/image/projects.jpg";
import BlurImage from "@/public/image/placeholder/blur.jpg";

import Hr from "@/components/Hr";
import ProjectCard from "./components/ProjectCard";
import FixedButon from "@/components/FixedButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function FeaturedHighlight({ project }) {
	if (!project) return null;

	const images = project.images?.length ? project.images : [];
	const thumbnail = project.thumbnail || project.imageUrl || BlurImage.src;
	const desc = project.desc || project.description || [];
	const tech = project.tech || project.techStack || [];

	const displayImages = [
		images[0] || thumbnail,
		images[1] || thumbnail,
		images[2] || thumbnail,
	];

	return (
		<>
			<div className="mt-10 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
				<div className="flex justify-center items-center flex-col my-5 self-start">
					<Hr variant="long" />
					<h1 className="text-3xl font-bold mt-3">Highlight</h1>
				</div>
			</div>
			<div className="relative w-screen mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10">
				{/* stacked images */}
				<div className="flex justify-center items-start flex-col mb-5">
					<div className="images relative w-full aspect-square">
						<div className="absolute top-28 left-10 h-[40%] aspect-video grayscale hover:grayscale-0 transition-all ease duration-300 hover:scale-150 z-10">
							<motion.div
								initial={{ opacity: 0, scale: 0.5, x: 100 }}
								whileInView={{ opacity: 1, scale: 1, x: 0 }}
								className="w-full h-full shadow-lg relative">
								<Image
									src={displayImages[0]}
									alt={project.title}
									fill
									sizes="300px"
									className="object-cover"
									blurDataURL={BlurImage.src}
									placeholder="blur"
								/>
							</motion.div>
						</div>
						<div className="absolute top-10 right-28 h-[30%] aspect-video grayscale hover:grayscale-0 transition-all ease duration-300 hover:scale-150">
							<motion.div
								initial={{ opacity: 0, scale: 0.5, x: -100 }}
								whileInView={{ opacity: 1, scale: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								className="w-full h-full shadow-lg relative">
								<Image
									src={displayImages[2]}
									alt={project.title}
									fill
									sizes="200px"
									className="object-cover"
									blurDataURL={BlurImage.src}
									placeholder="blur"
								/>
							</motion.div>
						</div>
						<div className="absolute bottom-10 md:bottom-26 right-20 h-[35%] aspect-video grayscale hover:grayscale-0 transition-all ease duration-300 hover:scale-150">
							<motion.div
								initial={{ opacity: 0, scale: 0.5, x: -100 }}
								whileInView={{ opacity: 1, scale: 1, x: 0 }}
								transition={{ delay: 0.5 }}
								className="w-full h-full shadow-lg relative">
								<Image
									src={displayImages[1]}
									alt={project.title}
									fill
									sizes="250px"
									className="object-cover"
									blurDataURL={BlurImage.src}
									placeholder="blur"
								/>
							</motion.div>
						</div>
					</div>
				</div>

				{/* text + links */}
				<motion.div
					className="flex justify-center items-start flex-col mb-5 md:px-10"
					initial={{ opacity: 0, x: 200 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.5, type: "spring" }}>
					<h2 className="text-2xl font-bold tracking-wider mb-3">{project.title}</h2>
					{tech.length > 0 && (
						<p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
							{tech.join(" · ")}
						</p>
					)}
					<p className="text-gray-600 text-justify title text-lg">
						{desc[0] || ""}
					</p>
					<div className="mt-4 flex flex-wrap gap-2">
						<Button variation="primary">
							<Link href={`/projects/${project.slug}`}>More</Link>
						</Button>
						{(project.liveLink || project.preview) && (
							<Button variation="secondary">
								<a
									href={project.liveLink || project.preview}
									target="_blank"
									rel="noopener noreferrer">
									Preview{" "}
									<FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-1 text-sm" />
								</a>
							</Button>
						)}
						{(project.githubLink || project.code) && (
							<Button variation="secondary">
								<a
									href={project.githubLink || project.code}
									target="_blank"
									rel="noopener noreferrer">
									GitHub{" "}
									<FontAwesomeIcon icon={faGithub} className="ml-1 text-sm" />
								</a>
							</Button>
						)}
					</div>
				</motion.div>
			</div>
		</>
	);
}

export default function Page() {
	const [activeCategory, setActiveCategory] = useState(null);
	const [projects, setProjects] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const visibleProjects = projects.filter(
		(item) => item.show === true && item.status !== "draft" && item.status !== "archived"
	);
	const featuredProject = visibleProjects.find((p) => p.featured);
	const gridProjects = visibleProjects.filter((p) => !p.featured);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			try {
				const [projRes, catRes] = await Promise.all([
					fetchJson("/api/projects"),
					fetchJson("/api/categories"),
				]);
				if (isMounted) {
					setProjects(projRes.data || []);
					setCategories(catRes.data || []);
					setError("");
				}
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
		<>
			<main className="overflow-hidden">
				<FixedButon href="/#projects">
					<FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
				</FixedButon>

				{/* hero */}
				<div className="relative h-screen w-screen gap-4 p-10 flex justify-center items-center flex-col mb-10 overflow-hidden">
					<div className="z-0 mb-48 md:mb-0 md:absolute top-1/4 md:right-[10%] md:-translate-y-16">
						<motion.div
							initial={{ scale: 1 }}
							animate={{ scale: 1.6 }}
							transition={{ duration: 1, ease: "circOut" }}
							className="bg-slate-300 rounded-sm h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0 relative">
							<Image
								src={ProjectAll}
								alt="Projects"
								fill
								className="object-cover"
								placeholder="blur"
							/>
						</motion.div>
					</div>
					<div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-10 pt-4 backdrop-filter backdrop-blur-sm md:backdrop-blur-none md:backdrop-filter-none bg-gray-100 bg-opacity-50 md:bg-transparent md:pt-0">
						<h1 className="md:bg-white bg-transparent lg:bg-transparent bg-opacity-50 md-px-0 text-black text-5xl md:text-8xl font-bold">
							My Projects
						</h1>
						<Hr />
						<p className="title text-xl mt-4 tracking-wider text-gray-900 leading-[1.7rem] mb-5">
							List of my projects that I have done and{" "}
							<span className="bg-transparent md:bg-gray-100 bg-opacity-50 xl:bg-transparent">
								currently working on.
							</span>
						</p>
						<motion.div
							initial={{ opacity: 0, y: 100 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: "circOut" }}
							onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
							className="mb-3">
							<Button variation="primary">Scroll Down</Button>
						</motion.div>
					</div>
				</div>

				{/* featured / highlight — only shown when a project has featured=true */}
				{!isLoading && !error && <FeaturedHighlight project={featuredProject} />}

				{/* all projects */}
				<div className="mt-16 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
					<div className="flex justify-center items-center flex-col my-5 self-start">
						<Hr variant="long" />
						<motion.h1
							className="text-3xl font-bold mt-3"
							initial={{ opacity: 0, x: -200 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.7, type: "spring" }}>
							{featuredProject ? "Other Note Worthy Projects" : "All Projects"}
						</motion.h1>
					</div>
				</div>

				{/* category filter */}
				<motion.div
					initial={{ opacity: 0, x: 200 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ type: "spring" }}
					className="flex flex-row justify-center items-start flex-wrap gap-3 md:gap-5 my-5">
					<button
						className={`px-2 md:px-4 py-2 rounded-lg cursor-pointer transition-all ease duration-300 ${
							activeCategory === null
								? "bg-gray-300 text-black"
								: "bg-gray-700 text-white hover:bg-gray-300 hover:text-black"
						}`}
						onClick={() => setActiveCategory(null)}>
						All
					</button>
					{categories.map((cat) => (
						<button
							key={cat.id}
							className={`px-2 md:px-4 py-2 rounded-lg cursor-pointer transition-all ease duration-300 ${
								activeCategory === cat.id
									? "bg-gray-300 text-black hover:bg-gray-700 hover:text-white"
									: "bg-gray-700 text-white hover:bg-gray-300 hover:text-black"
							}`}
							onClick={() => setActiveCategory(cat.id)}>
							{cat.name}
						</button>
					))}
				</motion.div>

				{/* project grid */}
				<div className="w-screen mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10 cursor-pointer">
					{isLoading && <div className="text-gray-500">Loading projects...</div>}
					{!isLoading && error && <div className="text-red-600">{error}</div>}
					{!isLoading && !error && (featuredProject ? gridProjects : visibleProjects).map((project, index) => (
						<ProjectCard
							project={project}
							key={project.id || project._id || index}
							activeCategory={activeCategory}
						/>
					))}
					{!isLoading && !error && visibleProjects.length === 0 && (
						<p className="text-gray-500 col-span-2 text-center py-10">
							No projects to show yet.
						</p>
					)}
				</div>

				{/* archive link */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					className="flex justify-center items-center flex-col my-5">
					<Button variation="primary">
						<Link href="projects/archive">View In Archive</Link>
					</Button>
				</motion.div>
			</main>
		</>
	);
}
