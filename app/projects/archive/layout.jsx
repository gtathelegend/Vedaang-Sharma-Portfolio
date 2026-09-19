import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Project Archive | Vedaang Sharma",
  description:
    "Complete chronological archive of software projects, open-source tools, and technical experiments developed by Vedaang Sharma.",
  alternates: { canonical: "/projects/archive" },
  openGraph: {
    title: "Project Archive | Vedaang Sharma",
    description:
      "Complete chronological archive of software projects, open-source tools, and experiments by Vedaang Sharma.",
    url: `${SITE_URL}/projects/archive`,
    type: "website",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "Vedaang Sharma Project Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Archive | Vedaang Sharma",
    description:
      "Chronological catalog of engineering projects and open-source contributions by Vedaang Sharma.",
    images: ["/og-image-rev.png"],
  },
};

export default function ProjectArchiveLayout({ children }) {
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: "Archive", url: "/projects/archive" },
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
