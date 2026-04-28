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
			className="flex items-center gap-3.5 px-3 py-3 -mx-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 group transition-all"
		>
			<div
				className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
				style={{ backgroundColor: cfg.color + "22" }}
			>
				<FontAwesomeIcon icon={cfg.icon} style={{ color: cfg.color }} className="text-base" />
			</div>
			<span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
				{cfg.label}
			</span>
			<div
				className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
				style={{ backgroundColor: cfg.color + "18" }}
			>
				<FontAwesomeIcon
					icon={faArrowUpRightFromSquare}
					style={{ color: cfg.color }}
					className="text-[9px]"
				/>
			</div>
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

	const hasRightCol = research.length > 0 || credentials.length > 0;

	return (
		<main className="min-h-screen bg-white dark:bg-gray-950">

			{/* Hero */}
			<section className="relative pt-28 md:pt-36 pb-10 overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-violet-100 dark:bg-violet-500/10 blur-3xl opacity-60" />
					<div className="absolute top-16 left-0 h-64 w-64 rounded-full bg-indigo-100 dark:bg-indigo-500/10 blur-3xl opacity-50" />
				</div>
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-10"
					>
						<FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
						Back home
					</Link>
					<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-violet-500 dark:text-violet-400 mb-3">
						Let&apos;s connect
					</p>
					<h1 className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
						Get in touch.
					</h1>
					<p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
						Drop a message about a project, collaboration, or just to say hi — I&apos;ll
						usually reply within a day or two.
					</p>
				</div>
			</section>

			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 space-y-6">

					{/* ── Links panel ── */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: "spring", stiffness: 90, damping: 18 }}
						className="rounded-3xl overflow-hidden shadow-[0_4px_40px_-8px_rgba(99,102,241,0.18)] border border-indigo-100 dark:border-indigo-500/20"
					>
						{/* Gradient header strip */}
						<div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
							<div className="pointer-events-none absolute inset-0">
								<div className="absolute -top-8 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
								<div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" />
							</div>
							<div className="relative grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
								{[
									{ icon: faEnvelope, label: "Email",      value: emailText, href: emailHref },
									{ icon: faMapPin,   label: "Location",   value: "Jaipur, India" },
									{ icon: faClock,    label: "Reply time", value: "Within 1–2 days" },
								].map(({ icon, label, value, href }) => (
									<div key={label} className="flex items-center gap-3.5 px-7 py-6">
										<div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
											<FontAwesomeIcon icon={icon} className="text-white text-sm" />
										</div>
										<div className="min-w-0">
											<p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">
												{label}
											</p>
											{href ? (
												<a href={href} className="text-sm font-semibold text-white hover:text-white/80 break-all transition">
													{value}
												</a>
											) : (
												<p className="text-sm font-semibold text-white">{value}</p>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Social links body */}
						<div className={`bg-white dark:bg-gray-900 grid grid-cols-1 ${hasRightCol ? "md:grid-cols-2" : ""} divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/10`}>

							{primary.length > 0 && (
								<div className="p-7">
									<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
										Connect
									</p>
									<div className="space-y-1">
										{primary.map((s) => <SocialRow key={s.platform} social={s} />)}
									</div>
								</div>
							)}

							{hasRightCol && (
								<div className="p-7 space-y-7">
									{research.length > 0 && (
										<div>
											<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
												Writing &amp; research
											</p>
											<div className="space-y-1">
												{research.map((s) => <SocialRow key={s.platform} social={s} />)}
											</div>
										</div>
									)}
									{credentials.length > 0 && (
										<div>
											<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
												Credentials
											</p>
											<div className="flex flex-wrap gap-2">
												{credentials.map((s) => <CredentialChip key={s.platform} social={s} />)}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</motion.div>

					{/* ── Contact form ── */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.08 }}
						className="relative rounded-3xl bg-gray-900 overflow-hidden shadow-[0_4px_40px_-8px_rgba(139,92,246,0.25)]"
					>
						{/* Decorative orbs */}
						<div className="pointer-events-none absolute inset-0">
							<div className="absolute -top-28 -right-16 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
							<div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
							<div className="absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-pink-500/15 blur-3xl" />
						</div>

						<div className="relative p-8 sm:p-10">
							<h2 className="text-lg font-bold text-white mb-1">Send a message</h2>
							<p className="text-sm text-gray-400 mb-8">
								Your message lands directly in my inbox.
							</p>
							<div className="max-w-2xl">
								<ContactForm />
							</div>
						</div>
					</motion.div>

				</div>
			</section>
		</main>
	);
}
