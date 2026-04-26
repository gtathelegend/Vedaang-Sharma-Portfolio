"use client";
import SectionHeader from "@/components/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

const emptyExperiences = [];

function TimelineCard({ experience, index, isEven }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.15, duration: 0.5 }}
			viewport={{ once: true }}
			className={`flex ps-10 md:ps-0 ${
				isEven
					? "md:justify-center md:translate-x-1/2"
					: "md:justify-center md:-translate-x-1/2"
			} justify-center mb-4`}>
			<div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg border border-gray-700">
				<div className="flex items-center justify-center gap-4 flex-wrap">
					<div className="text-center">
						<div className="text-sm font-bold">{experience.startDate}</div>
						<div className="text-xs text-gray-300">Start</div>
					</div>
					<div className="w-px h-6 bg-gray-500"></div>
					<div className="text-center">
						<div className="text-sm font-bold">{experience.endDate}</div>
						<div className="text-xs text-gray-300">End</div>
					</div>
					<div className="w-px h-6 bg-gray-500"></div>
					<div className="text-center">
						<div className="text-sm font-medium text-gray-400">{experience.location}</div>
						<div className="text-xs text-gray-300">Location</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function ExperienceCard({ experience, index, isEven }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.2, duration: 0.6 }}
			viewport={{ once: true }}
			className={`relative group ${
				isEven ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12"
			} md:w-1/2`}>
			<div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300 ml-12 md:ml-0">
				<div className="mb-4">
					<h3 className="font-bold text-xl text-gray-900 mb-1">{experience.company}</h3>
					<h4 className="font-medium text-lg text-gray-700">
						{experience.position}
						<span className="text-sm font-normal text-gray-500 ml-2">• {experience.type}</span>
					</h4>
				</div>
				<p className="text-gray-600 text-justify leading-relaxed mb-4">{experience.description}</p>
				<div className="flex flex-wrap gap-2">
					{experience.skills.map((skill, idx) => (
						<span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-all duration-300">
							{skill}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default function Experience() {
	const [showAll, setShowAll] = useState(false);
	const [experiences, setExperiences] = useState(emptyExperiences);
	const [error, setError] = useState("");
	const displayedExperiences = showAll ? experiences : experiences.slice(0, 3);

	useEffect(() => {
		let isMounted = true;
		const loadExperience = async () => {
			try {
				const response = await fetchJson("/api/experience");
				if (isMounted) { setExperiences(response.data || []); setError(""); }
			} catch (err) {
				if (isMounted) setError("Unable to load experience right now.");
			}
		};
		loadExperience();
		return () => { isMounted = false; };
	}, []);

	return (
		<section className="py-16" aria-labelledby="professional-experience">
			<div className="mx-auto container px-8 md:px-16">
				<SectionHeader label="Career" heading="Professional Experience" id="professional-experience" />
			</div>
			<div className="mx-auto container px-6 py-10">
				<div className="flex justify-center items-center flex-col">
					<div className="relative w-full max-w-6xl mx-auto">
						<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-gray-900 via-gray-400 to-transparent h-full"></div>
						<div className="md:hidden absolute left-0 w-1 bg-gradient-to-b from-gray-900 via-gray-400 to-transparent h-full"></div>
						<div className="space-y-12 md:space-y-16 relative">
							<AnimatePresence>
								{error && <div className="text-red-600 text-center">{error}</div>}
								{!error && displayedExperiences.map((experience, index) => (
									<div key={experience._id || experience.id || index} className="relative">
										<TimelineCard experience={experience} index={index} isEven={index % 2 === 1} />
										<div className={`absolute w-6 h-6 bg-gray-900 rounded-full border-4 border-white shadow-lg z-30 md:left-1/2 md:-translate-x-1/2 md:top-4 left-0 -translate-x-1/2 top-5`} />
										<ExperienceCard experience={experience} index={index} isEven={index % 2 === 1} />
									</div>
								))}
							</AnimatePresence>
						</div>
						{experiences.length > 3 && (
							<motion.div className="flex justify-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }}>
								<button onClick={() => setShowAll(!showAll)}
									className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-sm flex items-center gap-2">
									{showAll ? (
										<>Show Less<svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
									) : (
										<>View More Experience<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
									)}
								</button>
							</motion.div>
						)}
						{!showAll && experiences.length > 3 && (
							<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
