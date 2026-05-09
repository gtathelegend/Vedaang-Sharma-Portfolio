import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapCertification }  from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[GET /api/certifications]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data.map(mapCertification) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();

  const record = {
    name:       body.name,
    issuer:     body.issuer || null,
    year:       body.year   || null,
    category:   body.category || null,
    url:        body.url    || null,
    sort_order: Number(body.sortOrder) || 0,
  };

  const { data, error } = await admin.from("certifications").insert(record).select().single();
  if (error) {
    console.error("[POST /api/certifications]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapCertification(data) }, { status: 201 });
}
