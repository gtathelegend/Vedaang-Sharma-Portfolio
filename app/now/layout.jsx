import Footer from "@/components/Footer";

export const metadata = {
	title: "Now",
	description:
		"What I'm working on, learning and reading right now — in the spirit of nownownow.com.",
};

export default function Layout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
