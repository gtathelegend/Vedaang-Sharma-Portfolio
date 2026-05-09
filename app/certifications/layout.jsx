import Footer from "@/components/Footer";

export const metadata = {
  title: "Vedaang | Certifications",
  description:
    "Verified credentials and certifications in AI, Cloud, DevOps, and engineering earned by Vedaang Sharma.",
};

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
