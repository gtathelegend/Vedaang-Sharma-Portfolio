import { createAdminClient } from "@/lib/supabase/admin";
import Footer from "@/components/Footer";
import { getBlogPostingSchema, getBreadcrumbListSchema } from "@/lib/seo/schema";

async function getPost(slug) {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("blog_posts")
      .select("title, excerpt, cover_image, published_at, created_at, updated_at, slug")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url: `/blog/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt || undefined,
    },
  };
}

export default async function BlogPostLayout({ children, params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const breadcrumbsJsonLd = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post?.title || slug, url: `/blog/${slug}` },
  ]);

  const blogPostJsonLd = post ? getBlogPostingSchema(post) : null;

  return (
    <>
      {breadcrumbsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
      )}
      {blogPostJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
        />
      )}
      {children}
      <Footer />
    </>
  );
}
