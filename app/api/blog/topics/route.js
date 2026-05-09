import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapBlogTopic }      from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_topics")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[GET /api/blog/topics]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data.map(mapBlogTopic) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body  = await request.json();
  const admin = createAdminClient();

  const record = {
    label:       body.label,
    description: body.description || null,
    sort_order:  Number(body.sortOrder) || 0,
  };

  const { data, error } = await admin.from("blog_topics").insert(record).select().single();
  if (error) {
    console.error("[POST /api/blog/topics]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapBlogTopic(data) }, { status: 201 });
}
