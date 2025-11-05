import "./globals.css";
import Navbar from "@/components/Navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "./nprogress.css";
import { Analytics } from "@vercel/analytics/react";
import Chat from "@/components/Chat";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";

export const metadata = {
    title: "Vedaang Sharma | Portfolio",

    description:
		"My name is Vedaang Sharma, I'm a web developer and I'm passionate about it. I'm currently studying at Vivekananda Global University, Jaipur, India.",

    author: "Vedaang Sharma",
    siteUrl: "https://www.vedaangsharma.dev",
    applicationName: "Vedaang Sharma Portfolio",

    keywords: [
		"vedaang",
		"vedaang sharma",
		"vedaang sharma portfolio",
		
	],

    openGraph: {
		type: "website",
		url: "https://www.vedaangsharma.dev",
		title: "Vedaang Sharma | Portfolio",
		site_name: "Vedaang Sharma | Portfolio",
		description: "My name is Vedaang Sharma, This is my portfolio website.",
		width: 1200,
		height: 630,
		images: [
			{
				url: "/og-image-rev.png",
				alt: "Vedaang Sharma Portfolio",
			},
		],
		site_name: "Vedaang Sharma | Portfolio",
	}
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ClientTopProgressBar />
				<Navbar />
				{children}
				<Chat />
				<Analytics />
			</body>
		</html>
	);
}
