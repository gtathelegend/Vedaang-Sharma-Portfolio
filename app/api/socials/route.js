import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapSocial }         from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("social_links").select("*").order("sort_order");
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map(mapSocial) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await createAdminClient().from("social_links").insert({
    platform:   body.platform,
    url:        body.url,
    icon_name:  body.iconName,
    sort_order: Number(body.sortOrder) || 0,
  }).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ data: mapSocial(data) }, { status: 201 });
}
