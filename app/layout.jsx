import "./globals.css";
import { Jost, Poppins } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";
import ShellChrome from "@/components/ShellChrome";
import AuroraBackground from "@/components/AuroraBackground";
import { THEME_INIT_SCRIPT } from "@/components/ThemeProvider";
import { ResumeDownloadProvider } from "@/context/ResumeDownloadContext";
import { getPersonSchema, getWebSiteSchema } from "@/lib/seo/schema";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vedaangsharma.in";

export const metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Vedaang Sharma | Portfolio",
		template: "%s | Vedaang Sharma",
	},
	description: "Vedaang Sharma — Full Stack Developer. High-performance web applications, AI systems, and thoughtful engineering.",
	icons: {
		icon: [{ url: "/favicon.ico" }],
	},
	authors: [{ name: "Vedaang Sharma", url: SITE_URL }],
	creator: "Vedaang Sharma",
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		title: "Vedaang Sharma | Portfolio",
		description: "Full Stack Developer. Projects, research, and technical writing by Vedaang Sharma.",
		siteName: "Vedaang Sharma",
		images: [
			{
				url: "/og-image-rev.png",
				width: 1200,
				height: 630,
				alt: "Vedaang Sharma — Full Stack Developer",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Vedaang Sharma | Portfolio",
		description: "Full Stack Developer. Projects, research, and technical writing by Vedaang Sharma.",
		images: ["/og-image-rev.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
	},
};

export default function RootLayout({ children }) {
	const personSchema = getPersonSchema();
	const websiteSchema = getWebSiteSchema();

	return (
		<html lang="en" className={`${jost.variable} ${poppins.variable}`} suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://challenges.cloudflare.com" />
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				{/* Structured data — parsed by Google & AI systems for Knowledge Graph */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
				/>
			</head>
			<body className="font-poppins text-gray-900 dark:text-gray-100 selection:bg-blue-600 selection:text-white">
				<ResumeDownloadProvider>
					<ClientTopProgressBar />
					<ShellChrome />
					<div className="relative isolate min-h-screen bg-white dark:bg-gray-950">
						<AuroraBackground />
						{children}
					</div>
					<Analytics />
					<SpeedInsights />
				</ResumeDownloadProvider>
			</body>
		</html>
	);
}
