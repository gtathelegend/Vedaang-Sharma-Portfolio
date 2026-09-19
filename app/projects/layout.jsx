import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { getItemListSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Projects",
  description: "Software projects by Vedaang Sharma — AI agents, full-stack web apps, computer vision systems, and cloud-native applications.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Vedaang Sharma",
    description: "Software projects by Vedaang Sharma — AI agents, full-stack web apps, computer vision systems, and cloud-native applications.",
    url: "/projects",
  },
};

export default async function Layout({ children }) {
  let projectItems = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("projects")
      .select("slug, title, description, short_desc, show, status")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    projectItems = (data || [])
      .filter((p) => p?.slug && p.show !== false && p.status !== "draft" && p.status !== "archived")
      .map((p) => ({
        name: p.title,
        url: `/projects/${p.slug}`,
        description: p.short_desc || (Array.isArray(p.description) ? p.description[0] : p.description),
      }));
  } catch (err) {
    console.warn("[projects/layout] Failed to fetch projects for ItemList schema:", err);
  }

  const itemListSchema = getItemListSchema({
    name: "Projects by Vedaang Sharma",
    description: metadata.description,
    path: "/projects",
    items: projectItems,
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
      <Footer />
    </>
  );
}