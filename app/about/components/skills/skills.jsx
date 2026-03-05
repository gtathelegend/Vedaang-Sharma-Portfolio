"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ActivityIcon, CodepenIcon, MobileIcon, WebhookIcon } from "./icons";

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
			"Firebase",
		],
		tools: [
			"Visual Studio Code",
			"Git",
			"GitHub",
			"Figma",
			"Vite",
			"Docker",
			"Kubernetes",
			"Google Cloud",
			"Postman",
		],
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
		tools: [
			"Postman",
			"Docker",
			"Kubernetes",
			"Swagger",
			"Git",
			"GitHub",
			"Google Cloud",
			"IBM Cloud",
		],
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
		languages: ["React Native", "JavaScript", "TypeScript", "Dart", "Flutter"],
		tools: ["Android Studio", "React Native CLI"],
	},
};

function SkillCard({ skill, isSelected, onClick }) {
	const Icon = skill.icon;

	return (
		<motion.button
			type="button"
			onClick={onClick}
			className={`relative w-full text-left cursor-pointer group p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
				isSelected
					? "bg-white/20 border-black border-2 shadow-lg"
					: "bg-white/10 border-gray-300/20 hover:bg-white/20 hover:border-gray-300/30"
			}`}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}>
			<div className="flex items-center gap-4 mb-3">
				<div className="rounded-full p-2 bg-white/30">
					<Icon className="w-5 h-5" />
				</div>
				<h3 className="text-xl font-semibold text-gray-900">{skill.title}</h3>
			</div>
			<p className="text-gray-700 text-sm leading-relaxed">{skill.description}</p>
		</motion.button>
	);
}

function SkillDetails({ selectedSkill }) {
	return (
		<motion.div
			key={selectedSkill.title}
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -12 }}
			transition={{ duration: 0.25 }}
			className="rounded-2xl border border-gray-300/30 bg-white/20 backdrop-blur-lg p-6">
			<h3 className="text-2xl font-semibold mb-4 text-gray-900">{selectedSkill.title}</h3>

			<div className="mb-5">
				<h4 className="font-medium text-gray-800 mb-3">Technologies</h4>
				<div className="flex flex-wrap gap-2">
					{selectedSkill.languages.map((language) => (
						<span
							key={language}
							className="px-3 py-1.5 rounded-full text-sm bg-gray-200/70 text-gray-800">
							{language}
						</span>
					))}
				</div>
			</div>

			<div>
				<h4 className="font-medium text-gray-800 mb-3">Tools</h4>
				<div className="flex flex-wrap gap-2">
					{selectedSkill.tools.map((tool) => (
						<span
							key={tool}
							className="px-3 py-1.5 rounded-full text-sm bg-gray-200/70 text-gray-800">
							{tool}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default function Skills() {
	const [selectedCategory, setSelectedCategory] = useState("web");
	const selectedSkill = skillCategories[selectedCategory];

	return (
		<div className="relative">
			<div className="mx-auto container px-6 py-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mb-10">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Skills</h2>
					<p className="text-gray-700 max-w-2xl">
						Select a category to see the specific technologies and tools I work with.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{Object.entries(skillCategories).map(([key, skill], index) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							viewport={{ once: true }}>
							<SkillCard
								skill={skill}
								isSelected={selectedCategory === key}
								onClick={() => setSelectedCategory(key)}
							/>
						</motion.div>
					))}
				</div>

				<AnimatePresence mode="wait">
					<SkillDetails selectedSkill={selectedSkill} />
				</AnimatePresence>
			</div>
		</div>
	);
}
