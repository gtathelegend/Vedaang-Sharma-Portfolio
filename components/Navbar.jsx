"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
	{ name: "Home",           href: "/" },
	{ name: "About",          href: "/about" },
	{ name: "Skills",         href: "/skills" },
	{ name: "Projects",       href: "/projects" },
	{ name: "Research",       href: "/research" },
	{ name: "Certifications", href: "/certifications" },
	{ name: "Blog",           href: "/blog" },
	{ name: "Contact",        href: "/contact" },
];

export default function Navbar({ introReady = false }) {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => { setIsNavOpen(false); }, [pathname]);

	return (
		<>
			{/* Floating navbar */}
			<div className="fixed top-4 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
				<motion.div
					className="w-full max-w-6xl pointer-events-auto"
					initial={{ y: -24, opacity: 0 }}
					animate={introReady ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
					transition={{ type: "spring", stiffness: 120, damping: 22, delay: introReady ? 0.5 : 0 }}
				>
					<div className="flex items-center justify-between gap-4 bg-white/75 dark:bg-gray-950/80 backdrop-blur-xl border border-gray-200/70 dark:border-white/10 rounded-2xl shadow-lg shadow-black/[0.06] dark:shadow-black/40 px-4 py-2.5">

						{/* Logo */}
						<Link
							href="/"
							className="shrink-0 text-sm font-bold text-gray-900 dark:text-white tracking-tight hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						>
							Vedaang Sharma
						</Link>

						{/* Desktop links */}
						<div className="hidden md:flex items-center gap-0.5">
							{navLinks.map((link) => {
								const active = pathname === link.href;
								return (
									<Link
										key={link.name}
										href={link.href}
										className={`relative px-3 py-1.5 text-[13px] font-medium rounded-xl transition-all duration-150 ${
											active
												? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
												: "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/5"
										}`}
									>
										{link.name}
										{active && (
											<motion.span
												layoutId="nav-pill"
												className="absolute inset-0 rounded-xl bg-gray-100 dark:bg-white/10 -z-10"
												transition={{ type: "spring", stiffness: 350, damping: 30 }}
											/>
										)}
									</Link>
								);
							})}
						</div>

						{/* Right actions */}
						<div className="flex items-center gap-2 shrink-0">
							<ThemeToggle />

							{/* Hamburger — mobile only */}
							<button
								className="flex md:hidden flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition"
								onClick={() => setIsNavOpen(!isNavOpen)}
								aria-label={isNavOpen ? "Close menu" : "Open menu"}
							>
								<motion.span
									className="block w-5 h-0.5 bg-gray-900 dark:bg-gray-100 rounded-full origin-center"
									animate={isNavOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
									transition={{ duration: 0.2 }}
								/>
								<motion.span
									className="block w-5 h-0.5 bg-gray-900 dark:bg-gray-100 rounded-full origin-center"
									animate={isNavOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
									transition={{ duration: 0.2 }}
								/>
							</button>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Mobile fullscreen menu */}
			<AnimatePresence>
				{isNavOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[55] md:hidden bg-white/96 dark:bg-gray-950/96 backdrop-blur-xl flex flex-col justify-center items-center"
					>
						<div className="flex flex-col items-center gap-6">
							<p className="text-[10px] font-bold uppercase tracking-[0.5rem] text-gray-400 mb-2">
								Menu
							</p>
							{navLinks.map((link, i) => (
								<motion.div
									key={link.name}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.06, type: "spring", stiffness: 200, damping: 20 }}
								>
									<Link
										href={link.href}
										onClick={() => setIsNavOpen(false)}
										className={`text-3xl font-bold transition-colors ${
											pathname === link.href
												? "text-gray-900 dark:text-white"
												: "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
										}`}
									>
										{link.name}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
