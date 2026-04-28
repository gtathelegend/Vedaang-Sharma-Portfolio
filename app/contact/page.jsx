"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import ContactForm from "@/components/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGithub,
	faLinkedin,
	faMedium,
	faGoogle,
	faResearchgate,
} from "@fortawesome/free-brands-svg-icons";
import {
	faEnvelope,
	faAward,
	faCertificate,
	faGraduationCap,
	faChevronLeft,
	faMapPin,
	faClock,
} from "@fortawesome/free-solid-svg-icons";

const PLATFORM_CONFIG = {
	linkedin: { label: "LinkedIn", icon: faLinkedin, color: "#0A66C2", emoji: "💼", tier: 1 },
	github: { label: "GitHub", icon: faGithub, color: "#24292e", emoji: "🖥", tier: 1 },
	email: { label: "Email", icon: faEnvelope, color: "#EA4335", emoji: "✉️", tier: 1 },
	medium: { label: "Medium", icon: faMedium, color: "#000000", emoji: "✏️", tier: 2 },
	google_scholar: { label: "Google Scholar", icon: faGraduationCap, color: "#4285F4", emoji: "🎓", tier: 2 },
	researchgate: { label: "ResearchGate", icon: faResearchgate, color: "#00CCBB", emoji: "🔬", tier: 2 },
	google_skills: { label: "Google Dev Profile", icon: faGoogle, color: "#34A853", emoji: "📷", tier: 3 },
	credly: { label: "Credly", icon: faAward, color: "#FF6B2B", emoji: "🏅", tier: 3 },
	accredible: { label: "Accredible", icon: faCertificate, color: "#6C3FC5", emoji: "📜", tier: 3 },
};

export default function ContactPage() {
	const [socials, setSocials] = useState([]);
	const [settings, setSettings] = useState(null);

	useEffect(() => {
		let mounted = true;
		Promise.all([
			fetchJson("/api/socials").catch(() => ({ data: [] })),
			fetchJson("/api/settings").catch(() => ({ data: {} })),
		]).then(([s, set]) => {
			if (!mounted) return;
			setSocials(s.data || []);
			setSettings(set.data || {});
		});
		return () => {
			mounted = false;
		};
	}, []);

	const sortedSocials = socials
		.slice()
		.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

	const tier1 = sortedSocials.filter((s) =>
		["email", "github", "linkedin"].includes(s.platform),
	);
	const tier2 = sortedSocials.filter((s) =>
		["medium", "google_scholar", "researchgate"].includes(s.platform),
	);
	const tier3 = sortedSocials.filter((s) =>
		["credly", "accredible", "google_skills"].includes(s.platform),
	);

	const emailSocial = tier1.find((s) => s.platform === "email");
	const emailHref =
		emailSocial?.url ||
		(settings?.email
			? settings.email.startsWith("mailto:")
				? settings.email
				: `mailto:${settings.email}`
			: "mailto:vedaangsharma2006@gmail.com");
	const emailText = emailHref.replace(/^mailto:/, "").split("?")[0];

	return (
		<main className="min-h-screen bg-white dark:bg-gray-950">
			{/* Hero */}
			<section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-blue-50 blur-3xl opacity-60" />
					<div className="absolute -top-12 left-1/4 h-64 w-64 rounded-full bg-purple-50 blur-3xl opacity-60" />
				</div>

				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-8"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back home
					</Link>

					<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3">
						Let&apos;s connect
					</p>
					<h1 className="text-gray-900 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight max-w-3xl mb-5">
						Get in touch.
					</h1>
					<p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl">
						Drop a message about a project, a collaboration, or just to say hi — I&apos;ll
						usually reply within a day or two.
					</p>
				</div>
			</section>

			{/* Body */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 items-start">
						{/* Form card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ type: "spring", stiffness: 90, damping: 18 }}
							viewport={{ once: true, amount: 0.2 }}
							className="rounded-3xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/60 shadow-[0_2px_30px_-12px_rgb(0_0_0_/_0.08)] p-6 sm:p-8 md:p-10"
						>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
								Send a message
							</h2>
							<p className="text-sm text-gray-500 mb-6">
								Your message lands directly in my inbox.
							</p>
							<ContactForm />
						</motion.div>

						{/* Sidebar */}
						<motion.aside
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.1 }}
							viewport={{ once: true, amount: 0.2 }}
							className="space-y-6"
						>
							{/* Quick info */}
							<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
								<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
									Quick info
								</p>
								<ul className="space-y-4">
									<li className="flex gap-3">
										<div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
											<FontAwesomeIcon icon={faEnvelope} className="text-gray-600 text-sm" />
										</div>
										<div className="min-w-0">
											<p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
												Email
											</p>
											<a
												href={emailHref}
												className="text-sm text-gray-800 hover:text-gray-900 break-all"
											>
												{emailText}
											</a>
										</div>
									</li>
									<li className="flex gap-3">
										<div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
											<FontAwesomeIcon icon={faMapPin} className="text-gray-600 text-sm" />
										</div>
										<div>
											<p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
												Location
											</p>
											<p className="text-sm text-gray-800">Jaipur, India</p>
										</div>
									</li>
									<li className="flex gap-3">
										<div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
											<FontAwesomeIcon icon={faClock} className="text-gray-600 text-sm" />
										</div>
										<div>
											<p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
												Reply time
											</p>
											<p className="text-sm text-gray-800">Within 1–2 days</p>
										</div>
									</li>
								</ul>
							</div>

							{/* Socials – tier 1 */}
							{tier1.length > 0 && (
								<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
									<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
										Connect
									</p>
									<div className="flex flex-wrap gap-2">
										{tier1.map((social) => {
											const cfg = PLATFORM_CONFIG[social.platform];
											if (!cfg || !social.url) return null;
											const isEmail = social.url.startsWith("mailto:");
											return (
												<a
													key={social.platform}
													href={social.url}
													target={isEmail ? undefined : "_blank"}
													rel={isEmail ? undefined : "noopener noreferrer"}
													className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90 transition"
													style={{ backgroundColor: cfg.color }}
												>
													<FontAwesomeIcon icon={cfg.icon} />
													{cfg.label}
												</a>
											);
										})}
									</div>
								</div>
							)}

							{/* Socials – tier 2 */}
							{tier2.length > 0 && (
								<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
									<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
										Research &amp; writing
									</p>
									<div className="flex flex-wrap gap-2">
										{tier2.map((social) => {
											const cfg = PLATFORM_CONFIG[social.platform];
											if (!cfg || !social.url) return null;
											return (
												<a
													key={social.platform}
													href={social.url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-80 transition"
													style={{ borderColor: cfg.color, color: cfg.color }}
												>
													<FontAwesomeIcon icon={cfg.icon} />
													{cfg.label}
												</a>
											);
										})}
									</div>
								</div>
							)}

							{/* Socials – tier 3 */}
							{tier3.length > 0 && (
								<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
									<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
										Credentials
									</p>
									<div className="flex flex-wrap gap-2">
										{tier3.map((social) => {
											const cfg = PLATFORM_CONFIG[social.platform];
											if (!cfg || !social.url) return null;
											return (
												<a
													key={social.platform}
													href={social.url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white shadow-sm"
													style={{ backgroundColor: cfg.color }}
												>
													<span>{cfg.emoji}</span>
													{cfg.label}
												</a>
											);
										})}
									</div>
								</div>
							)}
						</motion.aside>
					</div>
				</div>
			</section>
		</main>
	);
}
