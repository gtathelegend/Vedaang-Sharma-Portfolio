import Footer from "@/components/Footer";
import { getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
	title: "Contact",
	description: "Get in touch with Vedaang Sharma — open to collaborations, freelance work, or just a conversation about building something great.",
	alternates: { canonical: "/contact" },
	openGraph: {
		title: "Contact | Vedaang Sharma",
		description: "Get in touch with Vedaang Sharma — open to collaborations, freelance work, or just a conversation.",
		url: "/contact",
	},
};

export default function Layout({ children }) {
	const breadcrumbSchema = getBreadcrumbListSchema([
		{ name: "Home", url: "/" },
		{ name: "Contact", url: "/contact" },
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
