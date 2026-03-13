import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

function fmt(row) {
  return {
    ...row,
    _id: row.id,
    iconName: row.icon_name,
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
    .from("socials")
    .update({
      platform: body.platform,
      url: body.url,
      icon_name: body.iconName ?? body.icon_name ?? "",
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
  const { error } = await supabase.from("socials").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
