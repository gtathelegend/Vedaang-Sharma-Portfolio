import { NextResponse } from "next/server";
import { supabase, verifyAdminToken } from "@/lib/supabase";

const fmt = (row) => ({ ...row, _id: row.id });

// GET /api/skills – public
export async function GET() {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("skill_type", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(fmt) });
}

// POST /api/skills – protected
export async function POST(request) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("skills")
    .insert({
      name: body.name,
      category: body.category ?? "web",
      skill_type: body.skillType ?? body.skill_type ?? "technology",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) }, { status: 201 });
}
