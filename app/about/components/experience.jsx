"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import Hr from "@/components/Hr";
import Modal from "@/components/Modal";
import experiences from "@/json/experience.json";

function Title() {
	return (
		<div className="mt-16 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
			<div className="flex justify-center items-center flex-col my-5 self-start">
				<Hr variant="long" />
				<motion.h2
					className="text-3xl font-bold mt-3"
					initial={{ opacity: 0, x: -200 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.7, type: "spring" }}>
					Professional Experience
				</motion.h2>
			</div>
		</div>
	);
}

function TimelineCard({ experience, index, isEven }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.15, duration: 0.5 }}
			className={`flex justify-center pl-12 mb-4 md:w-1/2 ${isEven ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12 md:pl-0"}`}>
			<div className="bg-gradient-to-r from-inverse to-inverse-end text-white px-4 md:px-8 py-3 rounded-xl shadow-lg border border-line max-w-full">
				<div className="flex flex-wrap items-center justify-center gap-4">
					<div className="text-center">
						<div className="text-sm font-bold">{experience.startDate}</div>
						<div className="text-xs text-gray-300">Start</div>
					</div>
					<div aria-hidden="true" className="w-px h-8 bg-line" />
					<div className="text-center">
						<div className="text-sm font-bold">{experience.endDate}</div>
						<div className="text-xs text-gray-300">End</div>
					</div>
					<div aria-hidden="true" className="w-px h-8 bg-line" />
					<div className="text-center">
						<div className="text-sm font-medium text-inverse-muted">{experience.location}</div>
						<div className="text-xs text-gray-300">Location</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function ExperienceCard({ experience, index, isEven, onExpand }) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.2, duration: 0.6 }}
			className={`relative group md:w-1/2 ${isEven ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12"}`}>
			<div className="bg-surface/20 backdrop-blur-sm border border-line/30 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:bg-surface/30 transition-all duration-300 ml-12 md:ml-0">
				<div className="mb-4">
					<h3 className="font-bold text-xl text-ink mb-1">{experience.company}</h3>
					<h4 className="font-medium text-lg text-copy">
						{experience.position}
						<span className="text-sm font-normal text-muted ml-2">• {experience.type}</span>
					</h4>
					<p className="text-sm text-copy mt-2">
						<span className="font-medium">Industry:</span> {experience.industry}
					</p>
				</div>
				<p className="text-copy leading-relaxed mb-4">{experience.description}</p>
				<Button
					type="button"
					variation="primary"
					onClick={onExpand}
					aria-haspopup="dialog"
					aria-controls="experience-dialog"
					aria-label={`Expand ${experience.position} at ${experience.company}`}>
					Expand <FontAwesomeIcon icon={faChevronDown} className="ml-2" aria-hidden="true" />
				</Button>
			</div>
		</motion.article>
	);
}

function ExperienceModal({ experience, onClose }) {
	return (
		<Modal
			isOpen={Boolean(experience)}
			onClose={onClose}
			id="experience-dialog"
			titleId="experience-dialog-title"
			closeLabel="Close experience details">
			{experience && (
				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:flex md:overflow-hidden">
					<div className="shrink-0 bg-inverse px-6 pb-8 pt-16 text-white md:w-2/5 md:overflow-y-auto md:px-10">
						<h2 id="experience-dialog-title" className="mb-2 text-2xl font-semibold">{experience.company}</h2>
						<p className="title mb-8 text-xl text-inverse-muted">{experience.position}</p>
						<dl className="space-y-6">
							{[
								["Dates", `${experience.startDate} – ${experience.endDate}`],
								["Work arrangement", experience.type],
								["Location", experience.location],
								["Industry", experience.industry],
							].map(([label, value]) => (
								<div key={label}>
									<dt className="text-sm text-inverse-muted">{label}</dt>
									<dd className="mt-1 leading-relaxed">{value}</dd>
								</div>
							))}
						</dl>
					</div>
					<div className="px-6 pb-10 pt-8 md:w-3/5 md:overflow-y-auto md:px-10 md:pt-16">
						<h3 className="mb-5 text-2xl font-semibold text-ink">Experience details</h3>
						<p className="mb-6 break-words text-base leading-8 text-copy">{experience.description}</p>
						{experience.highlights?.length > 0 && (
							<div className="mb-8">
								<h4 className="mb-3 text-xl font-semibold text-ink">Work & achievements</h4>
								<ul className="space-y-4 text-base leading-8 text-copy">
									{experience.highlights.map((highlight) => (
										<li key={highlight}>{highlight}</li>
									))}
								</ul>
							</div>
						)}
						{experience.skills?.length > 0 && (
							<div className="mb-8">
								<h4 className="mb-3 text-xl font-semibold text-ink">Skills</h4>
								<div className="flex flex-wrap gap-2">
									{experience.skills.map((skill) => (
										<span key={skill} className="bg-soft/60 border border-line/40 text-ink px-3 py-1 rounded-full text-sm font-medium">
											{skill}
										</span>
									))}
								</div>
							</div>
						)}
						{experience.companyWebsite && (
							<a href={experience.companyWebsite} target="_blank" rel="noopener noreferrer" className="title text-copy underline underline-offset-4 hover:text-ink">
								Visit {experience.company} website ↗
							</a>
						)}
					</div>
				</div>
			)}
		</Modal>
	);
}

function Wrapper({ children }) {
	return (
		<div className="mx-auto container px-6 py-10">
			<div className="flex justify-center items-center flex-col">{children}</div>
		</div>
	);
}

export default function Experience() {
	const [selectedExperience, setSelectedExperience] = useState(null);

	return (
		<section id="experience" className="scroll-mt-24">
			<Title />
			<Wrapper>
				<div className="relative w-full max-w-6xl mx-auto">
					<div aria-hidden="true" className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-accent via-line to-transparent h-full" />
					<div aria-hidden="true" className="md:hidden absolute left-0 w-1 bg-gradient-to-b from-accent via-line to-transparent h-full" />
					<div className="space-y-12 md:space-y-16 relative">
						{experiences.map((experience, index) => (
							<div key={experience.id} className="relative">
								<TimelineCard experience={experience} index={index} isEven={index % 2 === 1} />
								<div aria-hidden="true" className="absolute w-6 h-6 bg-accent rounded-full border-4 border-canvas shadow-lg z-30 md:left-1/2 md:-translate-x-1/2 md:top-4 left-0 -translate-x-1/2 top-5" />
								<ExperienceCard
									experience={experience}
									index={index}
									isEven={index % 2 === 1}
									onExpand={() => setSelectedExperience(experience)}
								/>
							</div>
						))}
					</div>
				</div>
			</Wrapper>
			<ExperienceModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />
		</section>
	);
}
