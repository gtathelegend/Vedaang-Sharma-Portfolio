import "./globals.css";
import { Jost, Poppins } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "./nprogress.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";
import ShellChrome from "@/components/ShellChrome";
import AuroraBackground from "@/components/AuroraBackground";
import { THEME_INIT_SCRIPT } from "@/components/ThemeProvider";

const jost = Jost({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-jost",
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-poppins",
});

export const viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#ffffff",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vedaangsharma.dev";

export const metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Vedaang Sharma | Portfolio",
		template: "%s | Vedaang Sharma",
	},
	description: "Vedaang Sharma — Full Stack & AI Systems Developer. I build high-performance web apps, AI-powered products, and thoughtful user experiences.",
	icons: {
		icon: [{ url: "/favicon.ico" }],
	},
	keywords: [
		"Vedaang Sharma",
		"Portfolio",
		"Full Stack Developer",
		"AI Systems Developer",
		"Next.js",
		"React",
		"Node.js",
	],
	authors: [{ name: "Vedaang Sharma" }],
	creator: "Vedaang Sharma",
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		title: "Vedaang Sharma | Portfolio",
		description: "Full Stack & AI Systems Developer. Projects, research, and writing by Vedaang Sharma.",
		siteName: "Vedaang Sharma",
		images: [
			{
				url: "/og-image-rev.png",
				width: 1200,
				height: 630,
				alt: "Vedaang Sharma",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Vedaang Sharma | Portfolio",
		description: "Full Stack & AI Systems Developer. Projects, research, and writing by Vedaang Sharma.",
		images: ["/og-image-rev.png"],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={`${jost.variable} ${poppins.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
			</head>
			<body className="font-poppins text-gray-900 dark:text-gray-100 selection:bg-blue-600 selection:text-white">
				<ClientTopProgressBar />
				<ShellChrome />
				<div className="relative isolate min-h-screen bg-white dark:bg-gray-950">
					<AuroraBackground />
					{children}
				</div>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
