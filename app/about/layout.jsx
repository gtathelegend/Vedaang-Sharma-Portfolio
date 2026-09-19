import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/seo/config";
import { getProfilePageSchema, getFAQPageSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "About",
  description: "Learn about Vedaang Sharma — Full Stack Developer pursuing BCA in Cloud Computing and Full Stack Development at VGU, published researcher, and builder of AI systems.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Vedaang Sharma",
    description: "Learn about Vedaang Sharma — Full Stack Developer pursuing BCA in Cloud Computing and Full Stack Development, published researcher, and builder of AI systems.",
    url: "/about",
  },
};

export default function Layout({ children }) {
  const profilePageSchema = getProfilePageSchema("/about", "About Vedaang Sharma", metadata.description);
  const faqPageSchema = getFAQPageSchema(SITE_CONFIG.faqsAbout);
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      {faqPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
      <Footer />
    </>
  );
}
