"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const FOOTER_LINKS = [
	{
		group: "Pages",
		links: [
			{ label: "Home", href: "/" },
			{ label: "About", href: "/about" },
			{ label: "Skills", href: "/skills" },
		],
	},
	{
		group: "Work",
		links: [
			{ label: "Projects", href: "/projects" },
			{ label: "Research", href: "/research" },
			{ label: "Blog", href: "/blog" },
			{ label: "Archive", href: "/projects/archive" },
		],
	},
	{
		group: "Connect",
		links: [
			{ label: "Contact", href: "/contact" },
			{ label: "GitHub", href: "https://github.com/gtathelegend", external: true },
			{ label: "LinkedIn", href: "https://www.linkedin.com/in/vedaangsharma2006/", external: true },
			{ label: "Email", href: "mailto:vedaangsharma2006@gmail.com", external: true },
		],
	},
];

export default function Footer() {
	return (
		<footer className="bg-gradient-to-b from-[#FFFBEB]/80 to-[#FAFAF9]/80 border-t border-amber-200/40 dark:border-[color:var(--color-border)] dark:bg-gradient-to-b dark:from-[color:var(--color-bg)] dark:to-[color:var(--color-bg-alt)]">
			{/* CTA strip */}
			<div className="flex justify-center items-center py-12 md:py-16 px-6">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", delay: 0.1 }}
					viewport={{ once: true }}>
					<span className="inline-block text-[10px] font-bold uppercase tracking-[.35rem] text-amber-700 bg-amber-100/80 border border-amber-200/60 px-3 py-1.5 rounded-full mb-5 dark:text-amber-200 dark:bg-amber-400/10 dark:border-amber-400/20">
						Interested?
					</span>
					<h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-[color:var(--color-text)]">
						Let&apos;s Work Together
					</h2>
					<Link
						href="/contact"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm dark:bg-[color:var(--color-text)] dark:text-[color:var(--color-bg)] dark:hover:bg-[color:var(--color-text-secondary)]">
						Get In Touch →
					</Link>
				</motion.div>
			</div>

			{/* Link columns */}
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-10 border-t border-amber-100/60 dark:border-[color:var(--color-border)]">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{/* Brand column */}
					<div className="col-span-2 md:col-span-1">
						<p className="text-base font-bold text-gray-900 mb-1 dark:text-[color:var(--color-text)]">Vedaang Sharma</p>
						<p className="text-xs text-gray-500 leading-relaxed max-w-[180px] dark:text-[color:var(--color-text-muted)]">
							Full Stack &amp; AI Systems Developer
						</p>
					</div>
					{/* Nav columns */}
					{FOOTER_LINKS.map((col) => (
						<div key={col.group}>
							<p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-3 dark:text-amber-300">
								{col.group}
							</p>
							<ul className="space-y-2">
								{col.links.map((link) => (
									<li key={link.label}>
										{link.external ? (
											<a
												href={link.href}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-gray-600 hover:text-gray-900 transition dark:text-[color:var(--color-text-secondary)] dark:hover:text-[color:var(--color-text)]"
											>
												{link.label}
											</a>
										) : (
											<Link
												href={link.href}
												className="text-sm text-gray-600 hover:text-gray-900 transition dark:text-[color:var(--color-text-secondary)] dark:hover:text-[color:var(--color-text)]"
											>
												{link.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Copyright & Legal */}
			<div className="flex justify-center items-center py-4 border-t border-amber-100/60 dark:border-[color:var(--color-border)]">
				<p className="text-gray-500 text-sm flex flex-wrap items-center justify-center gap-x-3 gap-y-1 dark:text-[color:var(--color-text-muted)]">
					<span>
						&copy;{new Date().getFullYear()}{" "}
						<span className="text-gray-900 font-medium dark:text-[color:var(--color-text)]">Vedaang Sharma</span>
					</span>
					<span className="text-gray-300 dark:text-gray-700">&bull;</span>
					<Link
						href="/privacy"
						className="hover:text-gray-900 dark:hover:text-[color:var(--color-text)] transition"
					>
						Privacy Policy
					</Link>
				</p>
			</div>
		</footer>
	);
}
