import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { getItemListSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Research",
  description: "Published research and academic work by Vedaang Sharma — computer vision, AI systems, and human-centered intelligent interfaces.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research | Vedaang Sharma",
    description: "Published research and academic work by Vedaang Sharma — computer vision, AI systems, and human-centered intelligent interfaces.",
    url: "/research",
  },
};

export default async function Layout({ children }) {
  let papersList = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("research_papers")
      .select("id, title, abstract, project_slug, year, venue, doi_url")
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false });

    papersList = data || [];
  } catch (err) {
    console.warn("[research/layout] Failed to fetch research papers for schema:", err);
  }

  const itemListSchema = getItemListSchema({
    name: "Research & Publications by Vedaang Sharma",
    description: metadata.description,
    path: "/research",
    items: papersList.map((p) => ({
      name: p.title,
      description: p.abstract || `${p.venue || "Published paper"} (${p.year || ""})`,
      url: p.project_slug ? `/research/${p.project_slug}` : p.doi_url || "/research",
    })),
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
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
