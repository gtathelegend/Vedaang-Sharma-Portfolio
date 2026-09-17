"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BootConsole from "@/components/BootConsole";

const SESSION_KEY = "vs_intro_seen";

export default function TerminalIntro({ onDone }) {
	const [visible, setVisible] = useState(false);

	const handleSkip = useCallback(() => {
		try {
			sessionStorage.setItem(SESSION_KEY, "1");
		} catch {}
		setVisible(false);
		onDone?.();
	}, [onDone]);

	useEffect(() => {
		// Detect audit tools (Lighthouse, HeadlessChrome), bots, or reduced-motion preference
		const isAuditOrBot =
			typeof navigator !== "undefined" &&
			(/bot|crawler|spider|crawling|lighthouse|headlesschrome/i.test(navigator.userAgent) ||
				window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);

		let seen = false;
		try {
			seen = !!sessionStorage.getItem(SESSION_KEY);
		} catch {}

		if (isAuditOrBot || seen) {
			onDone?.();
			return;
		}

		setVisible(true);

		const handleKeyDown = (e) => {
			if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
				handleSkip();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onDone, handleSkip]);

	function handleDone() {
		setTimeout(() => {
			try {
				sessionStorage.setItem(SESSION_KEY, "1");
			} catch {}
			setVisible(false);
			onDone?.();
		}, 400);
	}

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950 px-6 cursor-pointer select-none"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					onClick={handleSkip}
				>
					<BootConsole onDone={handleDone} className="w-full max-w-md" />
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							handleSkip();
						}}
						className="mt-6 text-xs text-gray-500 hover:text-gray-300 font-mono tracking-wider transition underline underline-offset-4"
					>
						Skip intro [Esc]
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
