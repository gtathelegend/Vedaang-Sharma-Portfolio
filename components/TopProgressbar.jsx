"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
	showSpinner: false,
	trickleSpeed: 200,
	minimum: 0.08,
});

export default function TopProgressbar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		NProgress.done();
	}, [pathname, searchParams]);

	useEffect(() => {
		const handleAnchorClick = (e) => {
			const target = e.target.closest("a");
			if (!target) return;

			const href = target.getAttribute("href");
			const targetAttr = target.getAttribute("target");

			if (
				!href ||
				href.startsWith("#") ||
				href.startsWith("mailto:") ||
				href.startsWith("tel:") ||
				href.startsWith("javascript:") ||
				targetAttr === "_blank" ||
				e.ctrlKey ||
				e.metaKey ||
				e.shiftKey ||
				e.altKey
			) {
				return;
			}

			try {
				const url = new URL(target.href, window.location.href);
				if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
					NProgress.start();
				}
			} catch {}
		};

		document.addEventListener("click", handleAnchorClick, { capture: true });
		return () => {
			document.removeEventListener("click", handleAnchorClick, { capture: true });
		};
	}, []);

	return null;
}
