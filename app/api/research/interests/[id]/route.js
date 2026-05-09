import { createClient }          from "@/lib/supabase/server";
import { createAdminClient }     from "@/lib/supabase/admin";
import { mapResearchInterest }   from "@/lib/supabase/mappers";
import { NextResponse }          from "next/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function PUT(request, { params }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body  = await request.json();
  const admin = createAdminClient();

  const record = {
    title:       body.title,
    description: body.description || null,
    icon_name:   body.iconName    || "faCode",
    sort_order:  Number(body.sortOrder) || 0,
    updated_at:  new Date().toISOString(),
  };

  const { data, error } = await admin
    .from("research_interests")
    .update(record)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("[PUT /api/research/interests/:id]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapResearchInterest(data) });
}

export async function DELETE(request, { params }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin.from("research_interests").delete().eq("id", params.id);
  if (error) {
    console.error("[DELETE /api/research/interests/:id]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Deleted" });
}
