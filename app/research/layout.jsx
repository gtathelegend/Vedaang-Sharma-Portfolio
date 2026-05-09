import Footer from "@/components/Footer";

export const metadata = {
  title: "Vedaang | Research",
  description: "Published research and academic work by Vedaang Sharma — computer vision, AI systems, and human-centered intelligent interfaces.",
};

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
