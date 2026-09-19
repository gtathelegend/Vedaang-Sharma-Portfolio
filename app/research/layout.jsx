import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Vedaang Sharma Research | AI, Software & Technology",
  description:
    "Published research and academic work by Vedaang Sharma — real-time computer vision systems, pose detection algorithms, and privacy-preserving intelligent interfaces.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Vedaang Sharma Research | AI, Software & Technology",
    description:
      "Academic papers and engineering research by Vedaang Sharma in computer vision, real-time AI, and applied machine learning.",
    url: `${SITE_URL}/research`,
    type: "website",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "Vedaang Sharma Research Publications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedaang Sharma Research | AI, Software & Technology",
    description:
      "Academic research on real-time computer vision and intelligent AI systems by Vedaang Sharma.",
    images: ["/og-image-rev.png"],
  },
};

export default function ResearchLayout({ children }) {
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
  ]);

  return (
    <>
      {breadcrumbsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
      )}
      {children}
      <Footer />
    </>
  );
}
