import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProject }        from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map(mapProject) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("projects").insert({
    title:       body.title,
    slug:        body.slug,
    year:        body.year ? Number(body.year) : null,
    description: body.description || [],
    tech_stack:  body.techStack || [],
    category:    (body.category || []).map(Number),
    thumbnail:   body.imageUrl || body.thumbnail || null,
    github_link: body.githubLink || null,
    live_link:   body.liveLink || null,
    images:      body.images || [],
    featured:    body.featured ?? false,
    show:        body.show ?? true,
    status:      body.status || "published",
    sort_order:  body.sort_order || 0,
  }).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapProject(data) }, { status: 201 });
}
