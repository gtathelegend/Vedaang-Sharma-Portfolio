import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

// Normalize a Supabase row → API response shape.
// Includes backward-compat aliases used by existing frontend components.
function fmt(row) {
  return {
    ...row,
    _id: row.id,
    // camelCase aliases
    techStack: row.tech_stack ?? [],
    githubLink: row.github_link ?? "",
    liveLink: row.live_link ?? "",
    // legacy aliases (used by ProjectCard, archive, slug page)
    tech: row.tech_stack ?? [],
    desc: row.description ?? [],
    code: row.github_link ?? "",
    preview: row.live_link ?? "",
  };
}

// GET /api/projects – public, returns all visible projects
export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(fmt) });
}

// POST /api/projects – protected, creates a project
export async function POST(request) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: body.title,
      slug: body.slug,
      year: body.year ? Number(body.year) : null,
      description: body.description ?? [],
      tech_stack: body.techStack ?? [],
      github_link: body.githubLink ?? "",
      live_link: body.liveLink ?? "",
      thumbnail: body.imageUrl || body.thumbnail || "",
      images: body.images ?? [],
      category: body.category ?? [],
      featured: body.featured ?? false,
      show: body.show ?? true,
      sort_order: Number(body.sortOrder) || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) }, { status: 201 });
}
