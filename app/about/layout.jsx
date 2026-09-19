import Footer from "@/components/Footer";
import { SITE_URL, SITE_IDENTITY } from "@/lib/seo/config";
import { getProfilePageSchema, getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "About Vedaang Sharma | Full Stack Developer & BCA Student",
  description:
    "Learn about Vedaang Sharma — Full Stack Developer & BCA student in Cloud Computing & Full Stack Development at Vivekananda Global University, Jaipur. Specializing in AI/ML, distributed backends, and cloud systems.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Vedaang Sharma | Full Stack Developer & BCA Student",
    description:
      "Full Stack Developer specializing in Cloud Computing, AI/ML, backend engineering, and modern web applications. Academic roots in Jaipur, based in Gurugram.",
    url: `${SITE_URL}/about`,
    type: "profile",
    images: [
      {
        url: "/og-image-rev.png",
        width: 1200,
        height: 630,
        alt: "About Vedaang Sharma — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Vedaang Sharma | Full Stack Developer & BCA Student",
    description:
      "Full Stack Developer specializing in Cloud Computing, AI/ML, and backend engineering at Vivekananda Global University.",
    images: ["/og-image-rev.png"],
  },
};

export default function AboutLayout({ children }) {
  const profilePageJsonLd = getProfilePageSchema();
  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
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
