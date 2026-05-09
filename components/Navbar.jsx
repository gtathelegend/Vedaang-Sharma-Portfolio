"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
	{ name: "Home",     href: "/" },
	{ name: "About",    href: "/about" },
	{ name: "Skills",   href: "/skills" },
	{ name: "Projects", href: "/projects" },
	{ name: "Research", href: "/research" },
	{ name: "Blog",     href: "/blog" },
	{ name: "Now",      href: "/now" },
	{ name: "Contact",  href: "/contact" },
];

export default function Navbar() {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close menu on route change
	useEffect(() => { setIsNavOpen(false); }, [pathname]);

	return (
		<>
			<nav className={`fixed top-0 left-0 w-full h-16 z-[60] transition-all duration-300 px-6 md:px-12 flex justify-between items-center ${
				scrolled || isNavOpen
					? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm dark:bg-gray-950/80 dark:border-white/5"
					: "bg-transparent"
			}`}>
				{/* Logo */}
				<Link href="/" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
					Vedaang Sharma
				</Link>

				{/* Desktop Links */}
				<div className="hidden md:flex items-center gap-6 lg:gap-8">
					{navLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className={`text-sm font-semibold transition-colors hover:text-gray-900 dark:hover:text-white ${
								pathname === link.href
									? "text-gray-900 dark:text-white"
									: "text-gray-500 dark:text-gray-400"
							}`}
						>
							{link.name}
						</Link>
					))}
					<ThemeToggle className="ml-2" />
					<Link
						href="/admin"
						className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						Admin
					</Link>
				</div>

				{/* Mobile right cluster */}
				<div className="flex md:hidden items-center gap-2">
					<ThemeToggle />
					<button
						className="flex flex-col justify-center items-center gap-1.5 w-10 h-10 z-[70]"
						onClick={() => setIsNavOpen(!isNavOpen)}
						aria-label={isNavOpen ? "Close Menu" : "Open Menu"}
					>
						<motion.div
							className="w-6 h-0.5 bg-gray-900 dark:bg-gray-100 rounded-full"
							animate={isNavOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
						/>
						<motion.div
							className="w-6 h-0.5 bg-gray-900 dark:bg-gray-100 rounded-full"
							animate={isNavOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
						/>
					</button>
				</div>
			</nav>

			{/* Mobile / Slim Menu */}
			<AnimatePresence>
				{isNavOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="fixed inset-0 z-[55] md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg flex flex-col justify-center items-center"
					>
						<div className="flex flex-col items-center gap-7">
							<p className="text-[10px] font-bold uppercase tracking-[0.5rem] text-gray-400 mb-4">Menu</p>
							{navLinks.map((link, i) => (
								<motion.div
									key={link.name}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.08 }}
								>
									<Link
										href={link.href}
										className="text-3xl font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
										onClick={() => setIsNavOpen(false)}
									>
										{link.name}
									</Link>
								</motion.div>
							))}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="mt-8"
							>
								<Link
									href="/admin"
									className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white"
									onClick={() => setIsNavOpen(false)}
								>
									Admin Panel
								</Link>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
