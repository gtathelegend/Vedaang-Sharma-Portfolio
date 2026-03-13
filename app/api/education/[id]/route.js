import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

function fmt(row) {
  return {
    ...row,
    _id: row.id,
    startYear: row.start_year,
    endYear: row.end_year,
    achievements: row.achievements ?? [],
    images: row.images ?? [],
  };
}

export async function PUT(request, { params }) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await params;

  const { data, error } = await supabase
    .from("education")
    .update({
      institute: body.institute,
      degree: body.degree,
      start_year: body.startYear ?? body.start_year ?? "",
      end_year: body.endYear ?? body.end_year ?? "",
      summary: body.summary ?? "",
      gpa: body.gpa ?? "",
      images: body.images ?? [],
      achievements: body.achievements ?? [],
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) });
}

export async function DELETE(request, { params }) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase.from("education").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
