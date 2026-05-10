import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vedaangsharma.dev";

function url(path) {
  return `${SITE_URL}${path}`;
}

export default async function sitemap() {
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/skills", changeFrequency: "monthly", priority: 0.7 },
    { path: "/now", changeFrequency: "weekly", priority: 0.6 },
    { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
    { path: "/projects/archive", changeFrequency: "monthly", priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/research", changeFrequency: "monthly", priority: 0.6 },
    { path: "/certifications", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  ];

  const items = staticRoutes.map((r) => ({
    url: url(r.path),
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const admin = createAdminClient();

    const [{ data: projects }, { data: posts }, { data: papers }] =
      await Promise.all([
        admin
          .from("projects")
          .select("slug, updated_at, show, status")
          .order("sort_order", { ascending: true }),
        admin
          .from("blog_posts")
          .select("slug, updated_at, published")
          .order("published_at", { ascending: false, nullsFirst: false }),
        admin
          .from("research_papers")
          .select("project_slug, updated_at")
          .order("sort_order", { ascending: true }),
      ]);

    (projects || [])
      .filter((p) => p?.slug && p.show === true && p.status !== "draft")
      .forEach((p) => {
        items.push({
          url: url(`/projects/${p.slug}`),
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });

    (posts || [])
      .filter((p) => p?.slug && p.published === true)
      .forEach((p) => {
        items.push({
          url: url(`/blog/${p.slug}`),
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });

    (papers || [])
      .filter((p) => p?.project_slug)
      .forEach((p) => {
        items.push({
          url: url(`/research/${p.project_slug}`),
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "yearly",
          priority: 0.5,
        });
      });
  } catch (e) {
    console.warn("[sitemap] Falling back to static routes only", e);
  }

  return items;
}

