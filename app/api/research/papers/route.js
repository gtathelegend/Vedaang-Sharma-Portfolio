import { createClient }       from "@/lib/supabase/server";
import { createAdminClient }  from "@/lib/supabase/admin";
import { mapResearchPaper }   from "@/lib/supabase/mappers";
import { NextResponse }       from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("research_papers")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[GET /api/research/papers]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data.map(mapResearchPaper) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body  = await request.json();
  const admin = createAdminClient();

  const record = {
    title:        body.title,
    venue:        body.venue        || null,
    year:         body.year         || null,
    abstract:     body.abstract     || null,
    areas:        body.areas        || [],
    project_slug: body.projectSlug  || null,
    doi_url:      body.doiUrl       || null,
    content:      body.content      || null,
    sort_order:   Number(body.sortOrder) || 0,
  };

  const { data, error } = await admin.from("research_papers").insert(record).select().single();
  if (error) {
    console.error("[POST /api/research/papers]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: mapResearchPaper(data) }, { status: 201 });
}
