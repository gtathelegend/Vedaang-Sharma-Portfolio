import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data || {} });
}

export async function PUT(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();

  // Upsert single-row settings
  const { data: existing } = await admin.from("site_settings").select("id").limit(1).single();

  let result;
  if (existing) {
    const { data, error } = await admin.from("site_settings").update({
      ...body,
      updated_at: new Date().toISOString(),
    }).eq("id", existing.id).select().single();
    result = { data, error };
  } else {
    const { data, error } = await admin.from("site_settings").insert({
      ...body,
      updated_at: new Date().toISOString(),
    }).select().single();
    result = { data, error };
  }

  if (result.error) return NextResponse.json({ message: result.error.message }, { status: 500 });
  return NextResponse.json({ data: result.data });
}
