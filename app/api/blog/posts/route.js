import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapBlogPost }       from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  const admin = createAdminClient();

  let query = admin
    .from("blog_posts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (!all) query = query.eq("published", true);

  const { data, error } = await query;
  if (error) {
    console.error("[GET /api/blog/posts]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data.map(mapBlogPost) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body  = await request.json();
  const admin = createAdminClient();

  const record = {
    title:        body.title,
    slug:         body.slug,
    excerpt:      body.excerpt  || null,
    content:      body.content  || null,
    published:    body.published ?? false,
    published_at: body.published ? new Date().toISOString() : null,
    sort_order:   Number(body.sortOrder) || 0,
  };

  const { data, error } = await admin.from("blog_posts").insert(record).select().single();
  if (error) {
    console.error("[POST /api/blog/posts]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapBlogPost(data) }, { status: 201 });
}
