import Footer from "@/components/Footer";

export const metadata = {
	title: "Skills",
	description:
		"Skills, tools and technologies - frontend, backend, AI/ML, mobile, devops, and databases - that I work with day-to-day.",
};

export default function Layout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
