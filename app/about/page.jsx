"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import About from "./components/about/about.jsx";
import Experience from "./components/experience.jsx";
import Education from "./components/education.jsx";
import Quote from "./components/quote/quote.jsx";
import Hero from "@/public/image/me1.jpg";

export default function Page() {
	useEffect(() => { window.scrollTo(0, 0); }, []);

	return (
		<main className="overflow-hidden bg-white">
			{/* Hero */}
			<section className="relative min-h-[100svh] md:h-screen flex justify-center items-center overflow-hidden pt-24 md:pt-0 pb-12 md:pb-0">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-gray-100 blur-3xl opacity-70" />
				</div>
				<motion.div
					className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					initial={{ x: 80, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}>
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={Hero} fill className="object-cover object-top" alt="Vedaang Sharma" placeholder="blur" priority sizes="(max-width: 768px) 0px, 40vw" />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
					</div>
				</motion.div>
				<div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-8">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
					</Link>
					<div className="md:max-w-[58%] lg:max-w-[52%]">
						<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.05 }}>
							Get to know me
						</motion.p>
						<motion.h1 className="text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.15 }}>
							About Me
						</motion.h1>
						<motion.p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8"
							initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: 0.25 }}>
							A bit about who I am, where I come from, and what gets me excited about
							building software.
						</motion.p>
						<motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: 0.35 }}>
							<a href="#about-section"
								className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
								Read more <FontAwesomeIcon icon={faArrowRight} />
							</a>
							<Link href="/skills"
								className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
								See my skills
							</Link>
						</motion.div>
					</div>
				</div>
			</section>

			<div id="about-section"><About /></div>
			<Experience />
			<Education />
			<Quote />
		</main>
	);
}
