import { createClient } from "@/lib/supabase/server";
import { getSoftwareApplicationSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

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
    return { title: "Project Not Found" };
  }

  const title = project.seo_title || project.title || "Project";
  const description =
    project.seo_desc ||
    (Array.isArray(project.description) ? project.description[0] : project.description) ||
    "Project by Vedaang Sharma";
  const ogImage = project.thumbnail ? [{ url: project.thumbnail }] : [];

  return {
    title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title,
      description,
      url: `/projects/${slug}`,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage.map((i) => i.url),
    },
  };
}

export default async function ProjectSlugLayout({ children, params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  const breadcrumbsJsonLd = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project?.title || slug, url: `/projects/${slug}` },
  ]);

  const softwareJsonLd = project ? getSoftwareApplicationSchema(project) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
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
