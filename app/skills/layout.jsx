import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Vedaang Sharma Skills | Full Stack, AI, Cloud & Web Development",
  description:
    "Comprehensive technical skill set of Vedaang Sharma — Python, TypeScript, React, Next.js, FastAPI, Node.js, AWS, PostgreSQL, Docker, and AI/ML engineering.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Vedaang Sharma Skills | Full Stack, AI, Cloud & Web Development",
    description:
      "Explore the core technologies, frameworks, cloud tools, and AI capabilities utilized by Vedaang Sharma.",
    url: `${SITE_URL}/skills`,
    type: "website",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "Vedaang Sharma Technical Skills Matrix",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedaang Sharma Skills | Full Stack, AI, Cloud & Web Development",
    description:
      "Technical skills, languages, frameworks, and tools used by Vedaang Sharma.",
    images: ["/og-image-rev.png"],
  },
};

export default function SkillsLayout({ children }) {
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Skills", url: "/skills" },
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
