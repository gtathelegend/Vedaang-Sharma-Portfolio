import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faGraduationCap, faTrophy, faAward, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/api";
import SectionHeader from "@/components/SectionHeader";

const ACHIEVEMENT_COLORS = {
	faMedal: "from-amber-400 to-amber-600",
	faGraduationCap: "from-blue-400 to-blue-600",
	faTrophy: "from-yellow-400 to-yellow-600",
	faAward: "from-emerald-400 to-emerald-600",
};

export default function Education() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [education, setEducation] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const loadEducation = async () => {
			try {
				const response = await fetchJson("/api/education");
				const first = (response.data || [])[0] || null;
				if (isMounted) { setEducation(first); setError(""); }
			} catch (err) {
				if (isMounted) setError("Unable to load education right now.");
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};
		loadEducation();
		return () => { isMounted = false; };
	}, []);

	const iconMap = { faMedal, faGraduationCap, faTrophy, faAward };

	const achievementsByYear = useMemo(() => {
		const grouped = {};
		const achievements = education?.achievements || [];
		achievements.forEach((achievement) => {
			const year = achievement.year || new Date().getFullYear();
			if (!grouped[year]) grouped[year] = [];
			grouped[year].push({ ...achievement, icon: iconMap[achievement.iconName] || faAward });
		});
		return grouped;
	}, [education]);

	const allAchievements = Object.entries(achievementsByYear)
		.sort(([a], [b]) => parseInt(b) - parseInt(a))
		.flatMap(([year, achievements]) => achievements.map((a) => ({ ...a, year })));

	const VISIBLE_COUNT = 6;
	const visibleAchievements = isExpanded ? allAchievements : allAchievements.slice(0, VISIBLE_COUNT);
	const hasMoreAchievements = allAchievements.length > VISIBLE_COUNT;
	const summaryParagraphs = (education?.summary || "").split("\n\n");
	const imageList = education?.images || [];

	return (
		<section className="py-12 md:py-16" aria-labelledby="education-heading">
			<div className="mx-auto container px-6 sm:px-8 md:px-16">
				<SectionHeader label="Background" heading="Education" id="education-heading" />
			</div>
			<div className="mx-auto container gap-10 px-6 sm:px-8 md:px-16">
				<motion.div
					className="flex justify-center items-start flex-col"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
					viewport={{ once: true }}>
					<section className="grid gap-8 md:gap-12 w-full">
						<p className="text-gray-600 max-w-2xl">Get to know more about my educational background.</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Education Section - Left */}
							<motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
								{isLoading && <div className="text-gray-500">Loading education...</div>}
								{!isLoading && error && <div className="text-red-600">{error}</div>}
								{!isLoading && !error && education && (
									<div>
										<div className="font-medium text-lg mb-4 text-gray-600">{education.startYear} - {education.endYear}</div>
										<div>
											<h2 className="font-semibold text-xl text-gray-900">{education.institute}</h2>
											<h3 className="text-md font-normal mb-3 text-gray-600">{education.degree}</h3>
											{imageList.length > 0 && (
												<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 md:flex md:items-stretch md:h-[300px] xl:h-[400px]">
													{imageList.slice(0, 3).map((image, index) => (
														<div key={`${image}-${index}`} className="aspect-video sm:aspect-square md:aspect-auto md:flex-[1] md:transition-all md:duration-300 md:ease-in-out md:hover:flex-[3] group">
															<Image src={image} width={400} height={225} alt="Education" className="rounded-lg w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-300 ease-in-out" />
														</div>
													))}
												</div>
											)}
											<div className="text-gray-600 text-justify text-base leading-relaxed space-y-4">
												{summaryParagraphs.map((paragraph, index) => (<p key={index}>{paragraph}</p>))}
											</div>
											{education.gpa && (
												<div className="flex flex-wrap gap-2 mt-4 text-sm">
													<div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200 font-medium">GPA: {education.gpa}</div>
												</div>
											)}
										</div>
									</div>
								)}
							</motion.div>
							{/* Achievements Section - Right */}
							<motion.div className="flex flex-col justify-start" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }}>
								<h2 className="font-semibold text-xl mt-7 text-gray-900">Achievements</h2>
								<p className="text-md font-normal mb-3 md:mb-6 text-gray-600">Some of my achievements during my study.</p>
								<div className="relative">
									<div className="space-y-4">
										<AnimatePresence>
											{visibleAchievements.map((achievement, index) => (
												<motion.div key={`${achievement.year}-${index}`} className="group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
													{(index === 0 || visibleAchievements[index - 1]?.year !== achievement.year) && (
														<div className="flex items-center gap-3 mb-3 mt-2">
															<div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
																<span className="text-xs font-bold text-gray-600">{achievement.year}</span>
															</div>
															<div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
														</div>
													)}
													<div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
														<div className="flex items-center gap-4">
															<div className={`aspect-square w-10 rounded-full bg-gradient-to-r ${achievement.color || ACHIEVEMENT_COLORS[achievement.iconName] || "from-gray-400 to-gray-600"} flex items-center justify-center`}>
																<FontAwesomeIcon icon={achievement.icon} className="text-white h-5 w-5" />
															</div>
															<div>
																<h3 className="font-medium text-gray-900">{achievement.title}</h3>
																<p className="text-sm text-gray-600">{achievement.subtitle}</p>
																<div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
															</div>
														</div>
													</div>
												</motion.div>
											))}
										</AnimatePresence>
									</div>
									{!isExpanded && hasMoreAchievements && (
										<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
									)}
									{hasMoreAchievements && (
										<motion.div className="flex justify-center mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
											<button onClick={() => setIsExpanded(!isExpanded)}
												className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 text-sm font-semibold shadow-sm">
												<span>{isExpanded ? "Show Less" : `Show ${allAchievements.length - VISIBLE_COUNT} More`}</span>
												<FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="h-3 w-3" />
											</button>
										</motion.div>
									)}
								</div>
							</motion.div>
						</div>
					</section>
				</motion.div>
			</div>
		</section>
	);
}
