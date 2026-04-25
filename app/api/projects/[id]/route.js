import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProject }        from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function PUT(request, { params }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("projects").update({
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
    updated_at:  new Date().toISOString(),
  }).eq("id", params.id).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapProject(data) });
}

export async function DELETE(request, { params }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin.from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
