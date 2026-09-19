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
import { SITE_URL, SITE_IDENTITY } from "@/lib/seo/config";
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

export const metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Vedaang Sharma | Full Stack Developer, AI & Cloud Developer",
		template: "%s | Vedaang Sharma",
	},
	description:
		"Vedaang Sharma — Full Stack Developer specializing in Cloud Computing, AI/ML, backend engineering, and modern web development. BCA student at Vivekananda Global University, Jaipur.",
	icons: {
		icon: [{ url: "/favicon.ico" }],
	},
	authors: [{ name: SITE_IDENTITY.name, url: SITE_URL }],
	creator: SITE_IDENTITY.name,
	publisher: SITE_IDENTITY.name,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		title: "Vedaang Sharma | Full Stack Developer, AI & Cloud Developer",
		description:
			"Full Stack Developer specializing in Cloud Computing, AI/ML, backend engineering, and modern web applications. Explore projects, research, and technical case studies.",
		siteName: SITE_IDENTITY.name,
		images: [
			{
				url: "/og-image-rev.png",
				width: 1200,
				height: 630,
				alt: "Vedaang Sharma — Full Stack Developer, AI & Cloud Developer",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Vedaang Sharma | Full Stack Developer, AI & Cloud Developer",
		description:
			"Full Stack Developer specializing in Cloud Computing, AI/ML, backend engineering, and modern web applications.",
		images: ["/og-image-rev.png"],
		creator: "@gtathelegend",
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
	const personJsonLd = getPersonSchema();
	const websiteJsonLd = getWebSiteSchema();

	return (
		<html lang="en" className={`${jost.variable} ${poppins.variable}`} suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://challenges.cloudflare.com" />
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				{/* Canonical Entity Schemas for Search Engines */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
