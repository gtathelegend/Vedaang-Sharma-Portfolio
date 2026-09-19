import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/seo/config";
import { getScholarlyArticleSchema, getBreadcrumbSchema } from "@/lib/seo/schema";

async function getPaper(slug) {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("research_papers")
      .select("title, abstract, venue, year, project_slug, pdf_url")
      .eq("project_slug", slug)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const paper = await getPaper(slug);
  if (!paper) {
    return {
      title: "Research Paper Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${paper.title} | Research by Vedaang Sharma`;
  const description =
    paper.abstract ||
    [paper.venue, paper.year].filter(Boolean).join(" · ") ||
    "Research paper and scientific publication by Vedaang Sharma.";

  const canonicalUrl = `${SITE_URL}/research/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: "/og-image-rev.png",
          width: 1200,
          height: 630,
          alt: `${paper.title} — Research Publication`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image-rev.png"],
    },
  };
}

export default async function ResearchPaperLayout({ children, params }) {
  const { slug } = await params;
  const paper = await getPaper(slug);

  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: paper?.title || slug, url: `/research/${slug}` },
  ]);

  const articleJsonLd = paper ? getScholarlyArticleSchema(paper) : null;

  return (
    <>
      {breadcrumbsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
      )}
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
