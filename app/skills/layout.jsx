import Footer from "@/components/Footer";
import { getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
	title: "Skills",
	description: "Skills, tools, and technologies Vedaang Sharma works with day-to-day — frontend, backend, AI/ML, mobile, DevOps, and databases.",
	alternates: { canonical: "/skills" },
	openGraph: {
		title: "Skills | Vedaang Sharma",
		description: "Skills, tools, and technologies Vedaang Sharma works with day-to-day — frontend, backend, AI/ML, mobile, DevOps, and databases.",
		url: "/skills",
	},
};

export default function Layout({ children }) {
	const breadcrumbSchema = getBreadcrumbListSchema([
		{ name: "Home", url: "/" },
		{ name: "Skills", url: "/skills" },
	]);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			{children}
			<Footer />
		</>
	);
}
