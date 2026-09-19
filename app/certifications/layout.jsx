import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Vedaang Sharma Certifications | AWS, Google Cloud & More",
  description:
    "Verified professional certifications earned by Vedaang Sharma — AWS Cloud Quest: Solutions Architect, Google Cloud Engineer AI Agents (ADK), MERN Full Stack, and Cisco Network Security.",
  alternates: { canonical: "/certifications" },
  openGraph: {
    title: "Vedaang Sharma Certifications | AWS, Google Cloud & More",
    description:
      "Verified credentials in Cloud Architecture, AI Agent Engineering, Full Stack Development, and Network Security earned by Vedaang Sharma.",
    url: `${SITE_URL}/certifications`,
    type: "website",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "Vedaang Sharma Professional Certifications and Credentials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedaang Sharma Certifications | AWS, Google Cloud & More",
    description:
      "Verified credentials in Cloud Architecture, AI Engineering, and Full Stack Development.",
    images: ["/og-image-rev.png"],
  },
};

export default function CertificationsLayout({ children }) {
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Certifications", url: "/certifications" },
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
