"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

import Me from "@/public/image/me.jpg";
import MeAbout from "@/public/image/me2.jpg";
import Setup from "@/public/image/setup.jpg";
import ProjectAll from "@/public/image/projects.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faMedium, faGoogle, faResearchgate } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faAward, faCertificate, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

// Platform key → display config (must match the `platform` field saved in DB)
const PLATFORM_CONFIG = {
	linkedin:      { label: "LinkedIn",           icon: faLinkedin,       color: "#0A66C2", emoji: "💼", tier: 1 },
	github:        { label: "GitHub",             icon: faGithub,         color: "#24292e", emoji: "🖥", tier: 1 },
	email:         { label: "Email",              icon: faEnvelope,       color: "#EA4335", emoji: "✉️", tier: 1 },
	medium:        { label: "Medium",             icon: faMedium,         color: "#000000", emoji: "✏️", tier: 2 },
	google_scholar:{ label: "Google Scholar",     icon: faGraduationCap,  color: "#4285F4", emoji: "🎓", tier: 2 },
	researchgate:  { label: "ResearchGate",       icon: faResearchgate,   color: "#00CCBB", emoji: "🔬", tier: 2 },
	google_skills: { label: "Google Dev Profile", icon: faGoogle,         color: "#34A853", emoji: "📷", tier: 3 },
	credly:        { label: "Credly",             icon: faAward,          color: "#FF6B2B", emoji: "🏅", tier: 3 },
	accredible:    { label: "Accredible",         icon: faCertificate,    color: "#6C3FC5", emoji: "📜", tier: 3 },
};

const sectionVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideLeft = {
	hidden:  { x: -80, opacity: 0 },
	visible: (delay = 0) => ({
		x: 0,
		opacity: 1,
		transition: { type: "spring", delay },
	}),
};

const slideRight = {
	hidden:  { x: 80, opacity: 0 },
	visible: (delay = 0) => ({
		x: 0,
		opacity: 1,
		transition: { type: "spring", delay, stiffness: 100, damping: 20 },
	}),
};

const fadeUp = {
	hidden:  { y: 40, opacity: 0 },
	visible: (delay = 0) => ({
		y: 0,
		opacity: 1,
		transition: { type: "spring", delay },
	}),
};

export default function MyPage() {
	const [socials, setSocials]           = useState([]);
	const [socialError, setSocialError]   = useState("");
	const [settings, setSettings]         = useState(null);

	/* apply scroll-snap to <html> only while this page is mounted */
	useEffect(() => {
		const html = document.documentElement;
		html.style.scrollSnapType    = "y mandatory";
		html.style.overflowY         = "scroll";
		html.style.scrollBehavior    = "smooth";
		return () => {
			html.style.scrollSnapType = "";
			html.style.overflowY      = "";
			html.style.scrollBehavior = "";
		};
	}, []);

	useEffect(() => {
		let isMounted = true;
		Promise.all([
			fetchJson("/api/socials").catch(() => ({ data: [] })),
			fetchJson("/api/settings").catch(() => ({ data: {} })),
		]).then(([socialsRes, settingsRes]) => {
			if (!isMounted) return;
			setSocials(socialsRes.data || []);
			setSettings(settingsRes.data || {});
		}).catch(() => {
			if (isMounted) setSocialError("Unable to load data.");
		});
		return () => { isMounted = false; };
	}, []);

	const sortedSocials = socials.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
	const emailSocial   = sortedSocials.find((s) => s.iconName === "faEnvelope" || s.platform === "email");

	// Settings with fallbacks
	const fullName     = settings?.full_name     || "Vedaang Sharma";
	const tagline      = settings?.tagline        || "Full Stack Developer";
	const heroSubtitle = settings?.hero_subtitle  || "Hi! I\u2019m Vedaang Sharma, a full-stack developer specialising in modern web development using React, Node.js, and Next.js, with a growing focus on Artificial Intelligence.";
	const cvUrl        = settings?.resume_pdf_url || settings?.cv_url || "/docs/cv.pdf";
	const emailHref    = settings?.email
		? (settings.email.startsWith("mailto:") ? settings.email : `mailto:${settings.email}`)
		: emailSocial?.url || "mailto:vedaangsharma2006@gmail.com";
	const emailText    = emailHref.startsWith("mailto:") ? emailHref.replace("mailto:", "").split("?")[0] : emailHref;

	return (
		<div>
			{/* ── SECTION 1 · Home ─────────────────────────────────── */}
			<section id="home" className="h-screen relative flex justify-center items-center overflow-hidden bg-white" style={{ scrollSnapAlign: "start" }}>

				{/* Right – full-height photo */}
				<motion.div className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					variants={slideRight} custom={0.1} initial="hidden" animate="visible">
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={Me} fill className="object-cover object-top" alt={fullName} placeholder="blur" priority />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
					</div>
				</motion.div>

				{/* Left – content */}
				<div className="z-10 w-full md:w-[55%] md:absolute md:left-[5%] flex flex-col justify-center px-8 md:px-14">
					{/* Mobile avatar */}
					<div className="flex md:hidden justify-center mb-8">
						<div className="w-28 h-28 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 ring-2 ring-gray-200">
							<Image src={Me} width={112} height={112} className="object-cover object-top" alt={fullName} placeholder="blur" />
						</div>
					</div>

					<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
						variants={slideLeft} custom={0.05} initial="hidden" animate="visible">
						{fullName}
					</motion.p>
					<motion.h1 className="text-black text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold leading-tight mb-4"
						variants={slideLeft} custom={0.15} initial="hidden" animate="visible">
						{tagline}
					</motion.h1>
					<motion.p className="text-gray-600 text-base leading-relaxed max-w-lg mb-7"
						variants={slideLeft} custom={0.28} initial="hidden" animate="visible">
						{heroSubtitle}
					</motion.p>

					<motion.div className="flex flex-wrap gap-4 mb-7"
						variants={fadeUp} custom={0.38} initial="hidden" animate="visible">
						<div className="flex flex-col">
							<span className="text-xl font-bold text-gray-900">10+</span>
							<span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Projects</span>
						</div>
						<div className="w-px h-8 bg-gray-200 mt-1" />
						<div className="flex flex-col">
							<span className="text-xl font-bold text-gray-900">5+</span>
							<span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Certifications</span>
						</div>
						<div className="w-px h-8 bg-gray-200 mt-1" />
						<div className="flex flex-col">
							<span className="text-xl font-bold text-gray-900">3+</span>
							<span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Years Coding</span>
						</div>
					</motion.div>

					<motion.div className="flex gap-3" variants={fadeUp} custom={0.48} initial="hidden" animate="visible">
						<a href={cvUrl} target="_blank" rel="noopener noreferrer" download
							className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
							Download CV
						</a>
						<a href="#contact"
							className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
							Contact Me
						</a>
					</motion.div>
				</div>

				{/* Animated scroll cue */}
				<motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
					initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
					<span className="text-[10px] uppercase tracking-widest text-gray-300">scroll</span>
					<motion.div className="w-px h-8 bg-gray-300 origin-top"
						animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.6 }} />
				</motion.div>
			</section>

			{/* ── SECTION 2 · About ────────────────────────────────── */}
			<section id="about" className="h-screen relative flex justify-center items-center overflow-hidden bg-white" style={{ scrollSnapAlign: "start" }}>

				<motion.div className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					variants={slideRight} custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={MeAbout} fill className="object-cover object-center" alt="About" placeholder="blur" />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
					</div>
				</motion.div>

				<div className="z-10 w-full md:w-[55%] md:absolute md:left-[5%] flex flex-col justify-center px-8 md:px-14">
					<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
						variants={slideLeft} custom={0.05} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						About Me
					</motion.p>
					<motion.h2 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
						variants={slideLeft} custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						Who I Am
					</motion.h2>
					<motion.p className="text-gray-600 text-base leading-relaxed max-w-lg mb-7"
						variants={slideLeft} custom={0.25} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						A passionate developer who turns ideas into production-ready applications — specialising in full-stack
						web development, AI integration, and cloud-native architectures.
					</motion.p>

					<motion.div className="grid grid-cols-3 gap-3 mb-7 max-w-xs"
						variants={fadeUp} custom={0.35} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						{[{ v: "3+", l: "Years coding" },{ v: "10+", l: "Projects built" },{ v: "5+", l: "Tech stacks" }].map(s => (
							<div key={s.l} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
								<p className="text-xl font-bold text-gray-900">{s.v}</p>
								<p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.l}</p>
							</div>
						))}
					</motion.div>

					<motion.div variants={fadeUp} custom={0.42} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						<Link href="/about"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
							Learn More →
						</Link>
					</motion.div>
				</div>
			</section>

			{/* ── SECTION 3 · Projects ─────────────────────────────── */}
			<section id="projects" className="h-screen relative flex justify-center items-center overflow-hidden bg-white" style={{ scrollSnapAlign: "start" }}>

				<motion.div className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[40vw]"
					variants={slideRight} custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={ProjectAll} fill className="object-cover object-center" alt="Projects" placeholder="blur" />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
					</div>
				</motion.div>

				<div className="z-10 w-full md:w-[55%] md:absolute md:left-[5%] flex flex-col justify-center px-8 md:px-14">
					<motion.p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
						variants={slideLeft} custom={0.05} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						My Work
					</motion.p>
					<motion.h2 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
						variants={slideLeft} custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						Projects
					</motion.h2>
					<motion.p className="text-gray-600 text-base leading-relaxed max-w-lg mb-7"
						variants={slideLeft} custom={0.25} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						A curated collection of things I&apos;ve built — from AI-powered web apps to scalable backend systems.
						Each project reflects a problem solved and a skill sharpened.
					</motion.p>

					<motion.div className="flex flex-wrap gap-2 mb-7"
						variants={fadeUp} custom={0.35} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						{["Web Apps","AI & ML","Mobile","Open Source"].map(tag => (
							<span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
						))}
					</motion.div>

					<motion.div variants={fadeUp} custom={0.42} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						<Link href="/projects"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
							View All Projects →
						</Link>
					</motion.div>
				</div>
			</section>


			{/* ── SECTION 4 · Contact ──────────────────────────────── */}
			<section
				id="contact"
				className="h-screen relative flex justify-center items-center overflow-hidden bg-white"
				style={{ scrollSnapAlign: "start" }}>

				{/* Background image (right side) */}
				<motion.div
					className="z-0 hidden md:block md:absolute top-0 right-0 h-full w-[38vw]"
					variants={slideRight} custom={0.2}
					initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
					<div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700">
						<Image src={Setup} fill className="object-cover" alt="Setup" placeholder="blur" />
						<div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
					</div>
				</motion.div>

				{/* Content */}
				<div className="z-10 w-full md:w-[58%] md:absolute md:left-[5%] top-[8%] md:top-auto flex flex-col justify-center px-8 md:px-14 py-8 overflow-y-auto max-h-screen">

					{/* Heading */}
					<motion.p
						className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3"
						variants={slideLeft} custom={0.05}
						initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						Let&apos;s Connect
					</motion.p>
					<motion.h1
						className="text-black text-4xl md:text-5xl lg:text-6xl font-bold mb-3"
						variants={slideLeft} custom={0.1}
						initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						Get In Touch
					</motion.h1>
					<motion.p
						className="text-gray-600 text-base mt-1 mb-6 tracking-wide leading-relaxed max-w-lg"
						variants={slideLeft} custom={0.15}
						initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						Feel free to reach out — whether it&apos;s a project, collaboration, or just a hello.
					</motion.p>

					{/* ── TIER 1: Primary – Email, GitHub, LinkedIn ── */}
					<motion.div
						className="mb-5"
						variants={fadeUp} custom={0.2}
						initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
						<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Connect</p>
						<div className="flex flex-wrap gap-3">
							{sortedSocials.filter(s => ["email","github","linkedin"].includes(s.platform)).map((social, i) => {
								const cfg = PLATFORM_CONFIG[social.platform];
								if (!cfg || !social.url) return null;
								const isEmail = social.url.startsWith("mailto:");
								return (
									<motion.a
										key={social.platform}
										href={social.url}
										target={isEmail ? undefined : "_blank"}
										rel={isEmail ? undefined : "noopener noreferrer"}
										whileHover={{ y: -3, scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition-shadow hover:shadow-lg"
										style={{ backgroundColor: cfg.color }}>
										<FontAwesomeIcon icon={cfg.icon} className="text-base" />
										{cfg.label}
									</motion.a>
								);
							})}
						</div>
					</motion.div>

					{/* ── TIER 2: Academic & Writing ── */}
					{sortedSocials.some(s => ["medium","google_scholar","researchgate"].includes(s.platform)) && (
						<motion.div
							className="mb-5"
							variants={fadeUp} custom={0.32}
							initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
							<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Research &amp; Writing</p>
							<div className="flex flex-wrap gap-2">
								{sortedSocials.filter(s => ["medium","google_scholar","researchgate"].includes(s.platform)).map((social) => {
									const cfg = PLATFORM_CONFIG[social.platform];
									if (!cfg || !social.url) return null;
									return (
										<motion.a
											key={social.platform}
											href={social.url}
											target="_blank" rel="noopener noreferrer"
											whileHover={{ y: -2, scale: 1.02 }}
											className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:text-white"
											style={{ borderColor: cfg.color, color: cfg.color }}
											onMouseEnter={e => { e.currentTarget.style.backgroundColor = cfg.color; e.currentTarget.style.color = "#fff"; }}
											onMouseLeave={e => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = cfg.color; }}>
											<FontAwesomeIcon icon={cfg.icon} className="text-sm" />
											{cfg.label}
										</motion.a>
									);
								})}
							</div>
						</motion.div>
					)}

					{/* ── TIER 3: Certifications ── */}
					{sortedSocials.some(s => ["credly","accredible","google_skills"].includes(s.platform)) && (
						<motion.div
							variants={fadeUp} custom={0.44}
							initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
							<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Credentials &amp; Certifications</p>
							<div className="flex flex-wrap gap-2">
								{sortedSocials.filter(s => ["credly","accredible","google_skills"].includes(s.platform)).map((social) => {
									const cfg = PLATFORM_CONFIG[social.platform];
									if (!cfg || !social.url) return null;
									return (
										<motion.a
											key={social.platform}
											href={social.url}
											target="_blank" rel="noopener noreferrer"
											whileHover={{ scale: 1.05 }}
											className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
											style={{ backgroundColor: cfg.color }}>
											<span>{cfg.emoji}</span>
											{cfg.label}
										</motion.a>
									);
								})}
							</div>
						</motion.div>
					)}

					{/* Fallback email if no socials loaded */}
					{sortedSocials.length === 0 && (
						<a href={emailHref} className="text-gray-600 hover:text-gray-900 transition-colors text-lg mt-2">{emailText}</a>
					)}
				</div>
			</section>
		</div>
	);
}
