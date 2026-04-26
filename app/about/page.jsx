"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FixedButton from "@/components/FixedButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import About from "./components/about/about.jsx";
import Skills from "./components/skills/skills.jsx";
import Experience from "./components/experience.jsx";
import Education from "./components/education.jsx";
import Quote from "./components/quote/quote.jsx";
import Hero from "@/public/image/me1.jpg";

export default function Page() {
	useEffect(() => { window.scrollTo(0, 0); }, []);

	return (
		<main className="overflow-hidden bg-white">
			<FixedButton href="/#about">
				<FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
			</FixedButton>

			{/* Hero – home-page pattern */}
			<section className="relative h-screen flex justify-center items-center overflow-hidden">
				<motion.div
					className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					initial={{ x: 80, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}>
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={Hero} fill className="object-cover object-top" alt="Vedaang Sharma" placeholder="blur" priority />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
					</div>
				</motion.div>
				<div className="z-10 w-full md:w-[55%] md:absolute md:left-[5%] flex flex-col justify-center px-8 md:px-14">
					<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
						initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.05 }}>
						Get to know me
					</motion.p>
					<motion.h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
						initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.15 }}>
						About Me
					</motion.h1>
					<motion.p className="text-gray-600 text-base leading-relaxed max-w-lg mb-7"
						initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.25 }}>
						A brief introduction about me and my interests.
					</motion.p>
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.35 }}>
						<a href="#about-section"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
							Scroll Down ↓
						</a>
					</motion.div>
				</div>
			</section>

			{/* About bio */}
			<div id="about-section"><About /></div>

			{/* Skills */}
			<Skills />

			{/* Experience */}
			<Experience />

			{/* Education */}
			<Education />

			{/* Quote */}
			<Quote />
		</main>
	);
}
