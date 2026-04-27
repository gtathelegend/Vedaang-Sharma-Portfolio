"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-100">
			{/* CTA strip */}
			<div className="flex justify-center items-center py-12 md:py-16 px-6">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", delay: 0.1 }}
					viewport={{ once: true }}>
					<p className="text-[11px] font-bold uppercase tracking-[.35rem] text-gray-400 mb-3">
						Interested?
					</p>
					<h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
						Let&apos;s Work Together
					</h2>
					<Link
						href="/#contact"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-sm">
						Get In Touch →
					</Link>
				</motion.div>
			</div>
			{/* Copyright */}
			<div className="flex justify-center items-center py-4 border-t border-gray-100">
				<p className="text-gray-500 text-sm">
					&copy;{new Date().getFullYear()}{" "}
					<span className="text-gray-900 font-medium">Vedaang Sharma</span>
				</p>
			</div>
		</footer>
	);
}
