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

export const metadata = {
	title: {
		default: "Vedaang Sharma | Portfolio",
		template: "%s | Vedaang Sharma",
	},
	description: "Full Stack Developer specializing in React, Node.js, and Artificial Intelligence.",
	keywords: ["Vedaang Sharma", "Portfolio", "Web Developer", "AI Enthusiast", "Jaipur"],
	authors: [{ name: "Vedaang Sharma" }],
	creator: "Vedaang Sharma",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.vedaangsharma.dev",
		title: "Vedaang Sharma | Portfolio",
		description: "Full Stack Developer specializing in React, Node.js, and Artificial Intelligence.",
		siteName: "Vedaang Sharma",
		images: [
			{
				url: "/api/og?title=Vedaang%20Sharma&subtitle=Full%20Stack%20Developer%20%26%20AI%20Enthusiast",
				width: 1200,
				height: 630,
				alt: "Vedaang Sharma Portfolio",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Vedaang Sharma | Portfolio",
		description: "Full Stack Developer specializing in React, Node.js, and Artificial Intelligence.",
		images: ["/api/og?title=Vedaang%20Sharma&subtitle=Full%20Stack%20Developer%20%26%20AI%20Enthusiast"],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={`${jost.variable} ${poppins.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
			</head>
			<body className="font-poppins bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 selection:bg-blue-600 selection:text-white">
				<ClientTopProgressBar />
				<ShellChrome />
				{children}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
