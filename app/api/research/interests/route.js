import { createClient }          from "@/lib/supabase/server";
import { createAdminClient }     from "@/lib/supabase/admin";
import { mapResearchInterest }   from "@/lib/supabase/mappers";
import { NextResponse }          from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("research_interests")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[GET /api/research/interests]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data.map(mapResearchInterest) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body  = await request.json();
  const admin = createAdminClient();

  const record = {
    title:       body.title,
    description: body.description || null,
    icon_name:   body.iconName    || "faCode",
    sort_order:  Number(body.sortOrder) || 0,
  };

  const { data, error } = await admin.from("research_interests").insert(record).select().single();
  if (error) {
    console.error("[POST /api/research/interests]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapResearchInterest(data) }, { status: 201 });
}
