import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapEducation }      from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("education").select("*").order("start_year", { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map(mapEducation) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("education").insert({
    institute:    body.institute,
    degree:       body.degree,
    start_year:   Number(body.startYear),
    end_year:     body.endYear ? Number(body.endYear) : null,
    summary:      body.summary || null,
    gpa:          body.gpa || null,
    images:       body.images || [],
    achievements: body.achievements || [],
  }).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapEducation(data) }, { status: 201 });
}
