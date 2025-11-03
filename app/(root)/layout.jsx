"use client"
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }) {
	return (
		<>
			<Sidebar />
			<Analytics />
			{children}
		</>
	);
}
