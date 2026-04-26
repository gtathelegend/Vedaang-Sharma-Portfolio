import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapSkill }          from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

const LEVEL_ORDER = { expert: 0, advanced: 1, intermediate: 2, beginner: 3 };

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("*").order("name");
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Group by category, sort within each group by level (expert first)
  const grouped = {};
  for (const skill of data || []) {
    const cat = skill.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ id: skill.id, _id: skill.id, name: skill.name, level: skill.level, category: cat });
  }
  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99));
  }

  return NextResponse.json({ data: grouped });
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
