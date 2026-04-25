import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapEducation }      from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await createAdminClient().from("education").update({
    institute:    body.institute,
    degree:       body.degree,
    start_year:   Number(body.startYear),
    end_year:     body.endYear ? Number(body.endYear) : null,
    summary:      body.summary || null,
    gpa:          body.gpa || null,
    images:       body.images || [],
    achievements: body.achievements || [],
  }).eq("id", params.id).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapEducation(data) });
}

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { error } = await createAdminClient().from("education").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
