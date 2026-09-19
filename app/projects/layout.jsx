import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Vedaang Sharma Projects | Full Stack, AI, Cloud & IoT",
  description:
    "Engineering case studies and software projects by Vedaang Sharma — BehaviourSim, PostureSense, AEON Home, Aegis Care, Campus Swap, AI agents, and cloud systems.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Vedaang Sharma Projects | Full Stack, AI, Cloud & IoT",
    description:
      "Engineering case studies and software projects by Vedaang Sharma — BehaviourSim, PostureSense, AEON Home, Aegis Care, Campus Swap, and full-stack systems.",
    url: `${SITE_URL}/projects`,
    type: "website",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "Vedaang Sharma Software Projects Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedaang Sharma Projects | Full Stack, AI, Cloud & IoT",
    description:
      "Software engineering and AI systems portfolio by Vedaang Sharma.",
    images: ["/og-image-rev.png"],
  },
};

export default function ProjectsLayout({ children }) {
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
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