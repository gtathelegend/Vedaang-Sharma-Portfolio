import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

    const admin = createAdminClient();

    const { error } = await admin.storage
      .from("images")
      .upload("resume/current.pdf", file, {
        contentType: "application/pdf",
        cacheControl: "0",
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = admin.storage
      .from("images")
      .getPublicUrl("resume/current.pdf");

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
