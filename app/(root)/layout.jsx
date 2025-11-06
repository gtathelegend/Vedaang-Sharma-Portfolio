"use client"
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"


export default function RootLayout({ children }) {
	return (
		<>
			<Sidebar />
			<Analytics />
			<SpeedInsights />
			{children}
		</>
	);
}
