import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

function fmt(row) {
  return {
    ...row,
    _id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    sortOrder: row.sort_order,
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
    .from("experience")
    .update({
      company: body.company,
      position: body.position,
      start_date: body.startDate,
      end_date: body.endDate,
      description: body.description ?? "",
      type: body.type ?? "",
      location: body.location ?? "",
      skills: body.skills ?? [],
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

export async function DELETE(request, { params }) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
