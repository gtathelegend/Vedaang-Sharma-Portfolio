import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

function fmt(row) {
  return {
    ...row,
    _id: row.id,
    // camelCase aliases for frontend & admin
    startDate: row.start_date,
    endDate: row.end_date,
    sortOrder: row.sort_order,
  };
}

// GET /api/experience – public
export async function GET() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(fmt) });
}

// POST /api/experience – protected
export async function POST(request) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("experience")
    .insert({
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
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) }, { status: 201 });
}
