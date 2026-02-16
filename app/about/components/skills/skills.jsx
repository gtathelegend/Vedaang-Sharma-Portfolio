"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CodepenIcon, WebhookIcon, ActivityIcon } from "./icons"

const skillCategories = {
	web: {
		title: "Web Development",
		icon: CodepenIcon,
		description: "Building modern, responsive web applications",
		languages: [
			"HTML",
			"CSS",
			"JavaScript",
			"TypeScript",
			"PHP",
			"Python",
			"React",
			"NextJS",
			"TailwindCSS",
			"Bootstrap",
			"NodeJS",
			"ExpressJS",
			"Laravel",
			"Flask",
			"Django",
			"Firebase"
		],
		tools: ["Visual Studio Code", "Git", "Github", "Figma", "Vite", "Docker", "Kubernetes", "Google Cloud", "Postman"],
	},
	api: {
		title: "REST API",
		icon: WebhookIcon,
		description: "Creating robust and scalable backend services",
		languages: [
			"NodeJS",
			"ExpressJS",
			"PHP",
			"Laravel",
			"Python",
			"FastAPI",
			"Flask",
			"Django",
			"MySQL",
			"PostgreSQL",
			"MongoDB",
			"Firebase",
		],
		tools: ["Postman", "Docker", "Kubernetes", "Swagger", "Git", "Github", "Google Cloud", "IBM Cloud"],
	},
	ai: {
		title: "AI & Machine Learning",
		icon: ActivityIcon,
		description: "Developing intelligent solutions with ML/AI",
		languages: [
			"Python",
			"TensorFlow",
			"PyTorch",
			"Scikit-learn",
			"Pandas",
			"NumPy",
			"Jupyter",
			"OpenAI API",
			"Gemini API",
			"LangChain",
		],
		tools: [
			"Jupyter Notebook",
			"Google Colab",
			"Google Cloud AI",
			"AWS SageMaker",
			"IBM Watson",
		],
	},
	mobile: {
		title: "Mobile Development",
		icon: MobileIcon,
		description: "Cross-platform mobile app development",
		languages: [
			"React Native",
			"JavaScript",
			"TypeScript",
			"Dart",
			"Flutter",
		],
		tools: [
			"Android Studio",
			"React Native CLI",
		],
	},
};

function SkillCard({ skill, isSelected, onClick }) {
	const Icon = skill.icon;

	return (
		<motion.div
			onClick={onClick}
			className={`relative cursor-pointer group p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
				isSelected
					? "bg-white/20 border-black border-2 shadow-lg"
					: "bg-white/10 border-gray-300/20 hover:bg-white/20 hover:border-gray-300/30"
					import { useEffect, useMemo, useState } from "react";
			whileHover={{
					import { fetchJson } from "@/lib/api";
				scale: 1.05,
					const categoryMeta = {
						frontend: {
							title: "Frontend",
							icon: CodepenIcon,
							description: "UI and client-side development",
						},
						backend: {
							title: "Backend",
							icon: WebhookIcon,
							description: "APIs, services, and data layers",
						},
						tools: {
							title: "Tools",
							icon: ActivityIcon,
							description: "Developer tooling and platforms",
						},
					};
							transition={{ delay: 0.5 + index * 0.1 }}
							className="px-4 py-2 bg-gradient-to-r from-gray-300/60 to-gray-100/40 
						const [selectedCategory, setSelectedCategory] = useState("frontend");
						const [skills, setSkills] = useState([]);
						const [error, setError] = useState("");
						const [isLoading, setIsLoading] = useState(true);

						useEffect(() => {
							let isMounted = true;
							const loadSkills = async () => {
								try {
									const response = await fetchJson("/api/skills");
									if (isMounted) {
										setSkills(response.data || []);
										setError("");
									}
								} catch (err) {
									if (isMounted) {
										setError("Unable to load skills right now.");
									}
								} finally {
									if (isMounted) {
										setIsLoading(false);
									}
								}
							};

							loadSkills();
							return () => {
								isMounted = false;
							};
						}, []);

						const skillCategories = useMemo(() => {
							const tools = skills
								.filter((skill) => skill.category === "tools")
								.map((skill) => skill.name);

							return Object.keys(categoryMeta).reduce((acc, key) => {
								const categorySkills = skills
									.filter((skill) => skill.category === key)
									.map((skill) => skill.name);

								if (categorySkills.length === 0 && key !== "tools") {
									return acc;
								}

								acc[key] = {
									...categoryMeta[key],
									languages: key === "tools" ? tools : categorySkills,
									tools,
								};
								return acc;
							}, {});
						}, [skills]);

						useEffect(() => {
							const keys = Object.keys(skillCategories);
							if (keys.length && !skillCategories[selectedCategory]) {
								setSelectedCategory(keys[0]);
							}
						}, [skillCategories, selectedCategory]);

						const selectedSkill = skillCategories[selectedCategory];
									 backdrop-blur-sm hover:scale-105 transition-transform cursor-default
									 hover:bg-gradient-to-r hover:from-gray-400/60 hover:to-gray-200/50">
							{tool}
									{/* Skill Categories Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
										{isLoading && (
											<div className="text-gray-500">Loading skills...</div>
										)}
										{!isLoading && error && (
											<div className="text-red-600">{error}</div>
										)}
										{!isLoading && !error &&
											Object.entries(skillCategories).map(([key, skill], index) => (
			</motion.div>
		</motion.div>
	);
}

export default function Skills() {
	const [selectedCategory, setSelectedCategory] = useState("web");
	return (
		<div className="relative">
			<div className="mx-auto container px-6 py-20">
				<motion.div
										))}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}

									{/* Skill Details */}
									<AnimatePresence>
										{selectedSkill && (
											<SkillDetails selectedSkill={selectedSkill} />
										)}
									</AnimatePresence>
						category to see the specific technologies and tools I work with.
					</p>
				</motion.div>

				{/* Skill Categories Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{Object.entries(skillCategories).map(([key, skill], index) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}>
							<SkillCard
								skill={skill}
								isSelected={selectedCategory === key}
								onClick={() => setSelectedCategory(key)}
							/>
						</motion.div>
					))}
				</div>

				{/* Skill Details */}
				<AnimatePresence mode="wait">
					<SkillDetails selectedSkill={skillCategories[selectedCategory]} />
				</AnimatePresence>
			</div>
		</div>
	);
}
