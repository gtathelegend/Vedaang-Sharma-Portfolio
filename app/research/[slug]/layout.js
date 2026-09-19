import { createAdminClient } from "@/lib/supabase/admin";
import { getScholarlyArticleSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

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
  if (!paper) return { title: "Research Paper Not Found" };

  const title = paper.title;
  const description =
    paper.abstract ||
    [paper.venue, paper.year].filter(Boolean).join(" · ") ||
    "Research publication";

  return {
    title,
    description,
    alternates: { canonical: `/research/${slug}` },
    openGraph: {
      title,
      description,
      url: `/research/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ResearchPaperLayout({ children, params }) {
  const { slug } = await params;
  const paper = await getPaper(slug);

  const breadcrumbsJsonLd = getBreadcrumbListSchema([
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
