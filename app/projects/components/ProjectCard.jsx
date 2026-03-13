import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import BlurImage from "@/public/image/placeholder/blur.jpg";

export default function ProjectCard({ project, index, activeCategory }) {
	// category is now a text array e.g. ["web", "ai"]
	const projectCategories = project.category || [];
	if (!projectCategories.includes(activeCategory)) return null;

	// Support both new field names and legacy aliases
	const desc = project.description || project.desc || [];
	const tech = project.techStack || project.tech_stack || project.tech || [];
	const thumbnail = project.thumbnail || "";

	return (
		<Link href={"projects/" + project.slug} key={index}>
			<motion.div
				className="z-10 relative flex justify-center items-start flex-col mb-5 md:px-10 w-full h-auto bg-gray-400 group/tes py-20 px-5 md:py-2 aspect-video"
				initial={{ opacity: 0, x: -200 }}
				whileInView={{ opacity: 1, x: 0 }}
				transition={{ type: "spring" }}>
				{thumbnail && (
					<Image
						src={thumbnail}
						alt={project.title}
						layout="fill"
						objectFit="cover"
						placeholder="blur"
						className="bg-slate-950 opacity-10 group-hover/tes:opacity-100 transition-all ease duration-500"
						blurDataURL={BlurImage.src}
					/>
				)}
				<div className="absolute top-0 left-0 bg-gray-600 px-4 py-2">
					<h4 className="text-white">{project.year}</h4>
				</div>
				<div className="transition-all ease duration-500 opacity-100 content text-center group-hover/tes:opacity-0 z-10">
					<h1 className="text-3xl font-bold mb-3">{project.title}</h1>
					{desc.length > 0 && (
						<p>
							{desc[0].length > 125
								? `${desc[0].slice(0, 125)}...`
								: desc[0]}
						</p>
					)}
					<div className="flex justify-center items-center flex-row mt-5 flex-wrap">
						{tech.map((t, i) => (
							<span key={i} className="m-1 px-4 py-2 bg-gray-600 text-white">
								{t}
							</span>
						))}
					</div>
				</div>
			</motion.div>
		</Link>
	);
}

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	activeCategory: PropTypes.string.isRequired,
};
