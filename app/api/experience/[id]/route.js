import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapExperience }     from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await createAdminClient().from("experience").update({
    company:     body.company,
    role:        body.role,
    start_date:  body.startDate || null,
    end_date:    body.endDate || null,
    description: body.description || null,
    type:        body.type || null,
    location:    body.location || null,
    skills:      body.skills || [],
    sort_order:  Number(body.sortOrder) || 0,
  }).eq("id", params.id).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapExperience(data) });
}

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { error } = await createAdminClient().from("experience").delete().eq("id", params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
