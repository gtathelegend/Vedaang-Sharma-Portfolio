import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

function fmt(row) {
  return {
    ...row,
    _id: row.id,
    techStack: row.tech_stack ?? [],
    githubLink: row.github_link ?? "",
    liveLink: row.live_link ?? "",
    tech: row.tech_stack ?? [],
    desc: row.description ?? [],
    code: row.github_link ?? "",
    preview: row.live_link ?? "",
  };
}

// PUT /api/projects/[id] – update a project
export async function PUT(request, { params }) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await params;

  const { data, error } = await supabase
    .from("projects")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) });
}

// DELETE /api/projects/[id]
export async function DELETE(request, { params }) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
