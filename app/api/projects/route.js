import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProject }        from "@/lib/supabase/mappers";
import { NextResponse }      from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data.map(mapProject) });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();

  const record = {
    title:       body.title,
    slug:        body.slug,
    year:        body.year ? Number(body.year) : null,
    description: body.description || [],
    tech_stack:  body.techStack || [],
    category:    (body.category || []).map(Number),
    thumbnail:   body.imageUrl || body.thumbnail || null,
    github_link: body.githubLink || null,
    live_link:   body.liveLink || null,
    images:      body.images || [],
    featured:    body.featured ?? false,
    show:        body.show ?? true,
    sort_order:  Number(body.sort_order) || 0,
  };

  // Only add optional columns if they have values (guards against missing columns)
  if (body.status)               record.status                = body.status;
  if (body.seo_title)            record.seo_title             = body.seo_title;
  if (body.seo_desc)             record.seo_desc              = body.seo_desc;
  if (body.problemStatement)     record.problem_statement     = body.problemStatement;
  if (body.architectureNotes)    record.architecture_notes    = body.architectureNotes;
  if (body.engineeringDecisions) record.engineering_decisions = body.engineeringDecisions;
  if (body.challenges)           record.challenges            = body.challenges;
  if (body.lessonsLearned)       record.lessons_learned       = body.lessonsLearned;
  if (body.architectureDiagram)  record.architecture_diagram  = body.architectureDiagram;

  const { data, error } = await admin.from("projects").insert(record).select().single();

  if (error) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json({ message: error.message, details: error.details, hint: error.hint }, { status: 500 });
  }
  return NextResponse.json({ data: mapProject(data) }, { status: 201 });
}
