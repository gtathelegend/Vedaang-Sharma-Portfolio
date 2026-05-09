import Footer from "@/components/Footer";

export const metadata = {
  title: "Vedaang | Blog",
  description: "Technical writing on AI systems, full-stack engineering, and building software that matters — by Vedaang Sharma.",
};

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
