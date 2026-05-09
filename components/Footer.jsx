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
			{ label: "Now", href: "/now" },
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
			{ label: "GitHub", href: "https://github.com/vedaangsharma", external: true },
			{ label: "LinkedIn", href: "https://www.linkedin.com/in/vedaang-sharma", external: true },
			{ label: "Email", href: "mailto:vedaangsharma2006@gmail.com", external: true },
		],
	},
];

export default function Footer() {
	return (
		<footer className="bg-gradient-to-b from-[#FFFBEB]/80 to-[#FAFAF9]/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-amber-200/40 dark:border-white/5">
			{/* CTA strip */}
			<div className="flex justify-center items-center py-12 md:py-16 px-6">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", delay: 0.1 }}
					viewport={{ once: true }}>
					<span className="inline-block text-[10px] font-bold uppercase tracking-[.35rem] text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 px-3 py-1.5 rounded-full mb-5">
						Interested?
					</span>
					<h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
						Let&apos;s Work Together
					</h2>
					<Link
						href="/contact"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-sm">
						Get In Touch →
					</Link>
				</motion.div>
			</div>

			{/* Link columns */}
			<div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-10 border-t border-amber-100/60 dark:border-white/5">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{/* Brand column */}
					<div className="col-span-2 md:col-span-1">
						<p className="text-base font-bold text-gray-900 dark:text-white mb-1">Vedaang Sharma</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[180px]">
							Full Stack &amp; AI Systems Developer
						</p>
					</div>
					{/* Nav columns */}
					{FOOTER_LINKS.map((col) => (
						<div key={col.group}>
							<p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400/70 mb-3">
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
												className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
											>
												{link.label}
											</a>
										) : (
											<Link
												href={link.href}
												className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
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

			{/* Copyright */}
			<div className="flex justify-center items-center py-4 border-t border-amber-100/60 dark:border-white/5">
				<p className="text-gray-500 dark:text-gray-400 text-sm">
					&copy;{new Date().getFullYear()}{" "}
					<span className="text-gray-900 dark:text-white font-medium">Vedaang Sharma</span>
				</p>
			</div>
		</footer>
	);
}
