"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CodepenIcon, WebhookIcon, ActivityIcon, MobileIcon } from "./icons"

const skillCategories = {
	web: {
		title: "Software Development",
		icon: CodepenIcon,
		description: "Building modern, responsive web applications",
		languages: [
			"JavaScript",
			"TypeScript",
			"PHP",
			"Python",
			"React",
			"Preact",
			"NextJS",
			"Wordpress",
			"WooCommerce",
			"TailwindCSS",
			"Bootstrap",
			"NodeJS",
			"Bun",
			"ExpressJS",
			"Laravel",
			"Flask",
			"Django",
			"Firebase",
			"FastAPI"
		],
		tools: ["Visual Studio Code", "Git", "Github", "Figma", "Vite", "Docker", "Kubernetes", "Google Cloud", "Postman"],
	},
	api: {
		title: "REST API",
		icon: WebhookIcon,
		description: "Creating robust and scalable backend services",
		languages: [
			"NodeJS",
			"Bun",
			"ExpressJS",
			"PHP",
			"Laravel",
			"Python",
			"FastAPI",
			"Flask",
			"Django",
			"Spring Boot",
			"MySQL",
			"PostgreSQL",
			"MongoDB",
			"Firebase",
			"Cloudflare D1",
		],
		tools: ["Postman", "Docker", "Kubernetes", "Swagger", "Git", "Github", "Google Cloud", "Cloudflare Workers", "Durable Objects", "Cloudflare R2", "IBM Cloud", "Jira", "Trello"],
	},
	ai: {
		title: "AI & Machine Learning",
		icon: ActivityIcon,
		description: "Developing intelligent solutions with ML/AI",
		languages: [
			"Python",
			"TensorFlow",
			"TensorFlow Lite",
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
			"Native Java & Kotlin"
		],
		tools: [
			"Android Studio",
			"Visual Studio Code",
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
					? "bg-surface/20 border-accent border-2 shadow-lg"
					: "bg-surface/10 border-line/20 hover:bg-surface/20 hover:border-line/30"
			}`}
			whileHover={{
				scale: 1.05,
				rotateY: 5,
			}}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				type: "spring",
				stiffness: 300,
				damping: 20,
			}}>
			{/* Glow effect - removed for selected state */}
			{!isSelected && (
				<div className="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-50 bg-gradient-to-r from-line/20 to-copy/20 blur-xl" />
			)}

			<div className="relative z-10 flex flex-col items-center text-center space-y-4">
				<div
					className={`p-4 rounded-xl transition-all duration-300 ${
						isSelected ? "bg-surface/30" : "bg-surface/10 group-hover:bg-surface/20"
					}`}>
					<Icon className="w-8 h-8 text-ink" />
				</div>
				<div>
					<h3 className="font-semibold text-ink text-lg mb-2">
						{skill.title}
					</h3>
					<p className="text-copy text-sm leading-relaxed">
						{skill.description}
					</p>
				</div>
			</div>
		</motion.div>
	);
}

function SkillDetails({ selectedSkill }) {
	if (!selectedSkill) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="mt-12 space-y-8">
			{/* Languages & Frameworks */}
			<motion.div
				className="backdrop-blur-lg bg-surface/20 border border-line/30 rounded-2xl p-8"
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2 }}>
				<h3 className="text-2xl font-semibold text-ink mb-6 text-center">
					Languages & Frameworks
				</h3>
				<div className="flex flex-wrap justify-center gap-3">
					{selectedSkill.languages.map((lang, index) => (
						<motion.span
							key={lang}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3 + index * 0.1 }}
							className="px-4 py-2 bg-gradient-to-r from-soft/60 to-surface/40
									 border border-line/40 rounded-full text-ink font-medium
									 backdrop-blur-sm hover:scale-105 transition-transform cursor-default
									 hover:bg-gradient-to-r hover:from-soft-strong/60 hover:to-surface/50">
							{lang}
						</motion.span>
					))}
				</div>
			</motion.div>

			{/* Tools */}
			<motion.div
				className="backdrop-blur-lg bg-surface/20 border border-line/30 rounded-2xl p-8"
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.4 }}>
				<h3 className="text-2xl font-semibold text-ink mb-6 text-center">
					Tools & Technologies
				</h3>
				<div className="flex flex-wrap justify-center gap-3">
					{selectedSkill.tools.map((tool, index) => (
						<motion.span
							key={tool}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.5 + index * 0.1 }}
							className="px-4 py-2 bg-gradient-to-r from-soft-strong/60 to-soft/40
									 border border-line/40 rounded-full text-ink font-medium
									 backdrop-blur-sm hover:scale-105 transition-transform cursor-default
									 hover:bg-gradient-to-r hover:from-line/60 hover:to-soft/50">
							{tool}
						</motion.span>
					))}
				</div>
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
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center space-y-4 mb-16">
					<h2 className="text-5xl font-bold bg-gradient-to-r from-ink to-copy bg-clip-text text-transparent">
						Skills & Expertise
					</h2>
					<p className="text-copy max-w-2xl mx-auto text-lg leading-relaxed">
						Explore my technical skills across different domains. Click on any
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
