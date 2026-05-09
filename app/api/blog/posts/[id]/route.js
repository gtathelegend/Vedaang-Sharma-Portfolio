import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapBlogPost }       from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(request, { params }) {
  const { id } = await params;
  const admin  = createAdminClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq(isUuid ? "id" : "slug", id)
    .eq("published", true)
    .single();

  if (error || !data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ data: mapBlogPost(data) });
}

export async function PUT(request, { params }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body   = await request.json();
  const admin  = createAdminClient();

  const isPublished = body.published ?? false;
  const record = {
    title:        body.title,
    slug:         body.slug,
    excerpt:      body.excerpt  || null,
    content:      body.content  || null,
    published:    isPublished,
    published_at: isPublished ? (body.publishedAt || new Date().toISOString()) : null,
    sort_order:   Number(body.sortOrder) || 0,
    updated_at:   new Date().toISOString(),
  };

  const { data, error } = await admin.from("blog_posts").update(record).eq("id", id).select().single();
  if (error) {
    console.error("[PUT /api/blog/posts/:id]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapBlogPost(data) });
}

export async function DELETE(request, { params }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin  = createAdminClient();
  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("[DELETE /api/blog/posts/:id]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Deleted" });
}
