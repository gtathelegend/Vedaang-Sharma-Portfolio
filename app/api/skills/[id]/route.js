import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

const fmt = (row) => ({ ...row, _id: row.id });

export async function PUT(request, { params }) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await params;

  const { data, error } = await supabase
    .from("skills")
    .update({
      name: body.name,
      category: body.category ?? "web",
      skill_type: body.skillType ?? body.skill_type ?? "technology",
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
  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
