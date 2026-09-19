import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { getItemListSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "Blog",
  description: "Technical writing by Vedaang Sharma on AI systems, full-stack engineering, and building software that matters.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Vedaang Sharma",
    description: "Technical writing by Vedaang Sharma on AI systems, full-stack engineering, and building software that matters.",
    url: "/blog",
  },
};

export default async function Layout({ children }) {
  let postItems = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("blog_posts")
      .select("slug, title, excerpt, published, published_at")
      .order("published_at", { ascending: false, nullsFirst: false });

    postItems = (data || [])
      .filter((p) => p?.slug && p.published === true)
      .map((p) => ({
        name: p.title,
        url: `/blog/${p.slug}`,
        description: p.excerpt || p.title,
      }));
  } catch (err) {
    console.warn("[blog/layout] Failed to fetch blog posts for schema:", err);
  }

  const itemListSchema = getItemListSchema({
    name: "Blog Articles by Vedaang Sharma",
    description: metadata.description,
    path: "/blog",
    items: postItems,
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
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
