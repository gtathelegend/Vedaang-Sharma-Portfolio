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

// GET /api/education – public
export async function GET() {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(fmt) });
}

// POST /api/education – protected
export async function POST(request) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("education")
    .insert({
      institute: body.institute,
      degree: body.degree,
      start_year: body.startYear ?? body.start_year ?? "",
      end_year: body.endYear ?? body.end_year ?? "",
      summary: body.summary ?? "",
      gpa: body.gpa ?? "",
      images: body.images ?? [],
      achievements: body.achievements ?? [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: fmt(data) }, { status: 201 });
}
