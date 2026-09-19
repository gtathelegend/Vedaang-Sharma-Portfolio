import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo/config";
import { getSoftwareApplicationSchema, getBreadcrumbSchema } from "@/lib/seo/schema";

async function getProject(slug) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("title, description, seo_title, seo_desc, thumbnail, slug, tech_stack, github_link, live_link, category")
      .eq("slug", slug)
      .single();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = project.seo_title || `${project.title} | Vedaang Sharma Project`;
  const description =
    project.seo_desc ||
    (Array.isArray(project.description) ? project.description[0] : project.description) ||
    `${project.title} case study and architecture overview by Vedaang Sharma.`;

  const canonicalUrl = `${SITE_URL}/projects/${slug}`;
  const ogImageUrl = project.thumbnail
    ? project.thumbnail.startsWith("http")
      ? project.thumbnail
      : `${SITE_URL}${project.thumbnail}`
    : `${SITE_URL}/og-image-rev.png`;

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
          url: ogImageUrl,
          alt: `${project.title} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectSlugLayout({ children, params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  const breadcrumbsJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project?.title || slug, url: `/projects/${slug}` },
  ]);

  const softwareJsonLd = project ? getSoftwareApplicationSchema(project) : null;

  return (
    <>
      {breadcrumbsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
      )}
      {softwareJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
