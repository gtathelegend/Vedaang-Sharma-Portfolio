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
	faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

const PLATFORM_CONFIG = {
	linkedin:       { label: "LinkedIn",          icon: faLinkedin,      color: "#0A66C2" },
	github:         { label: "GitHub",             icon: faGithub,        color: "#6e40c9" },
	email:          { label: "Email",              icon: faEnvelope,      color: "#EA4335" },
	medium:         { label: "Medium",             icon: faMedium,        color: "#000000" },
	google_scholar: { label: "Google Scholar",     icon: faGraduationCap, color: "#4285F4" },
	researchgate:   { label: "ResearchGate",       icon: faResearchgate,  color: "#00CCBB" },
	google_skills:  { label: "Google Dev Profile", icon: faGoogle,        color: "#34A853" },
	credly:         { label: "Credly",             icon: faAward,         color: "#FF6B2B" },
	accredible:     { label: "Accredible",         icon: faCertificate,   color: "#6C3FC5" },
};

function SocialRow({ social }) {
	const cfg = PLATFORM_CONFIG[social.platform];
	if (!cfg || !social.url) return null;
	const isEmail = social.url.startsWith("mailto:");
	return (
		<a
			href={social.url}
			target={isEmail ? undefined : "_blank"}
			rel={isEmail ? undefined : "noopener noreferrer"}
			className="flex items-center gap-3.5 px-3 py-2.5 -mx-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 group transition-all"
		>
			<div
				className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
				style={{ backgroundColor: cfg.color + "22" }}
			>
				<FontAwesomeIcon icon={cfg.icon} style={{ color: cfg.color }} className="text-sm" />
			</div>
			<span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
				{cfg.label}
			</span>
			<FontAwesomeIcon
				icon={faArrowUpRightFromSquare}
				style={{ color: cfg.color }}
				className="text-[10px] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
			/>
		</a>
	);
}

function CredentialChip({ social }) {
	const cfg = PLATFORM_CONFIG[social.platform];
	if (!cfg || !social.url) return null;
	return (
		<a
			href={social.url}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white transition hover:opacity-85 hover:scale-[1.03] shadow-sm"
			style={{ backgroundColor: cfg.color }}
		>
			<FontAwesomeIcon icon={cfg.icon} className="text-[10px]" />
			{cfg.label}
		</a>
	);
}

function SectionLabel({ children }) {
	return (
		<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
			{children}
		</p>
	);
}

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
		return () => { mounted = false; };
	}, []);

	const sorted      = socials.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
	const primary     = sorted.filter((s) => ["linkedin", "github", "email"].includes(s.platform));
	const research    = sorted.filter((s) => ["medium", "google_scholar", "researchgate"].includes(s.platform));
	const credentials = sorted.filter((s) => ["credly", "accredible", "google_skills"].includes(s.platform));

	const emailSocial = sorted.find((s) => s.platform === "email");
	const emailHref =
		emailSocial?.url ||
		(settings?.email
			? settings.email.startsWith("mailto:") ? settings.email : `mailto:${settings.email}`
			: "mailto:vedaangsharma2006@gmail.com");
	const emailText = emailHref.replace(/^mailto:/, "").split("?")[0];

	const meta = [
		{ icon: faEnvelope, label: "Email",      value: emailText, href: emailHref },
		{ icon: faMapPin,   label: "Location",   value: "Jaipur, India" },
		{ icon: faClock,    label: "Reply time", value: "Within 1–2 days" },
	];

	return (
		<main className="min-h-screen bg-transparent">

			{/* Hero */}
			<section className="relative pt-24 sm:pt-28 md:pt-36 pb-8 sm:pb-10 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-violet-100 dark:bg-violet-500/10 blur-3xl opacity-60" />
					<div className="absolute top-16 left-0 h-64 w-64 rounded-full bg-indigo-100 dark:bg-indigo-500/10 blur-3xl opacity-50" />
				</div>
				<div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-8 sm:mb-10"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" aria-hidden="true" />
						Back home
					</Link>
					<p className="text-[11px] font-bold uppercase tracking-[.3rem] sm:tracking-[.35rem] text-violet-500 dark:text-violet-400 mb-3">
						Let&apos;s connect
					</p>
					<h1 className="text-gray-900 dark:text-white text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
						Get in touch.
					</h1>
					<p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
						Drop a message about a project, collaboration, or just to say hi - I&apos;ll
						usually reply within a day or two.
					</p>
				</div>
			</section>

			<section className="pb-20 sm:pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">

					{/* Unified split panel */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: "spring", stiffness: 90, damping: 18 }}
						className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-[0_4px_40px_-12px_rgba(99,102,241,0.18)] dark:shadow-[0_4px_40px_-12px_rgba(0,0,0,0.5)]"
					>
						<div className="grid grid-cols-1 lg:grid-cols-5">

							{/* ── Left: info + links ── */}
							<aside className="lg:col-span-2 relative p-6 sm:p-9 bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.04] dark:to-transparent border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/10">
								<div className="pointer-events-none absolute inset-0 overflow-hidden">
									<div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-violet-200/40 dark:bg-violet-500/10 blur-3xl" />
								</div>

								<div className="relative">
									{/* Meta */}
									<div className="space-y-1 mb-8">
										{meta.map(({ icon, label, value, href }) => (
											<div key={label} className="flex items-center gap-3.5 py-2">
												<div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center shrink-0">
													<FontAwesomeIcon icon={icon} className="text-violet-500 dark:text-violet-400 text-sm" />
												</div>
												<div className="min-w-0">
													<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
														{label}
													</p>
													{href ? (
														<a href={href} className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 break-all transition">
															{value}
														</a>
													) : (
														<p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</p>
													)}
												</div>
											</div>
										))}
									</div>

									{primary.length > 0 && (
										<div className="mb-7">
											<SectionLabel>Connect</SectionLabel>
											<div className="space-y-0.5">
												{primary.map((s) => <SocialRow key={s.platform} social={s} />)}
											</div>
										</div>
									)}

									{research.length > 0 && (
										<div className="mb-7">
											<SectionLabel>Writing &amp; research</SectionLabel>
											<div className="space-y-0.5">
												{research.map((s) => <SocialRow key={s.platform} social={s} />)}
											</div>
										</div>
									)}

									{credentials.length > 0 && (
										<div>
											<SectionLabel>Credentials</SectionLabel>
											<div className="flex flex-wrap gap-2">
												{credentials.map((s) => <CredentialChip key={s.platform} social={s} />)}
											</div>
										</div>
									)}
								</div>
							</aside>

							{/* ── Right: form ── */}
							<div className="lg:col-span-3 p-6 sm:p-9 lg:p-10">
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight">
									Send a message
								</h2>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-7">
									Fill out the form and your message lands directly in my inbox.
								</p>
								<ContactForm />
							</div>

						</div>
					</motion.div>

				</div>
			</section>
		</main>
	);
}
