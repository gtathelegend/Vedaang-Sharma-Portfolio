import { createAdminClient } from "@/lib/supabase/admin";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo/config";
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/lib/seo/schema";

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
  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title} | Vedaang Sharma Blog`;
  const description =
    post.excerpt || `Technical article on ${post.title} by Vedaang Sharma.`;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const ogImageUrl = post.cover_image
    ? post.cover_image.startsWith("http")
      ? post.cover_image
      : `${SITE_URL}${post.cover_image}`
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
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || post.published_at,
      images: [
        {
          url: ogImageUrl,
          alt: post.title,
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

export default async function BlogPostLayout({ children, params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const breadcrumbsJsonLd = getBreadcrumbSchema([
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
