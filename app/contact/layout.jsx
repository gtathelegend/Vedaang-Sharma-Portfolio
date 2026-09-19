import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Contact Vedaang Sharma | Full Stack & AI Developer",
  description:
    "Get in touch with Vedaang Sharma — open for full stack engineering collaborations, AI/ML systems development, technical projects, or consulting.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Vedaang Sharma | Full Stack & AI Developer",
    description:
      "Get in touch with Vedaang Sharma — open for engineering opportunities and technical collaborations.",
    url: `${SITE_URL}/contact`,
    type: "website",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "Contact Vedaang Sharma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Vedaang Sharma | Full Stack & AI Developer",
    description:
      "Get in touch with Vedaang Sharma for engineering projects and collaborations.",
    images: ["/og-image-rev.png"],
  },
};

export default function ContactLayout({ children }) {
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
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
