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

// GET /api/socials – public
export async function GET() {
  const { data, error } = await supabase
    .from("socials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(fmt) });
}

// POST /api/socials – protected
export async function POST(request) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("socials")
    .insert({
      platform: body.platform,
      url: body.url,
      icon_name: body.iconName ?? body.icon_name ?? "",
      sort_order: Number(body.sortOrder) || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) }, { status: 201 });
}
