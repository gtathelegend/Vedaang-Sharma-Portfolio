import Footer from "@/components/Footer";

export const metadata = {
	title: "Contact",
	description:
		"Get in touch with Vedaang Sharma — collaborations, freelance work, or just to say hello.",
};

export default function Layout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
