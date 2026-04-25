import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapSkill }          from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("*").order("name");
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map(mapSkill) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("skills")
    .insert({ name: body.name, category: body.category, level: body.level })
    .select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapSkill(data) }, { status: 201 });
}
