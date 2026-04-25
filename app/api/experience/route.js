import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapExperience }     from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("experience").select("*").order("sort_order");
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map(mapExperience) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await createAdminClient().from("experience").insert({
    company:     body.company,
    role:        body.role,
    start_date:  body.startDate || null,
    end_date:    body.endDate || null,
    description: body.description || null,
    type:        body.type || null,
    location:    body.location || null,
    skills:      body.skills || [],
    sort_order:  Number(body.sortOrder) || 0,
  }).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapExperience(data) }, { status: 201 });
}
