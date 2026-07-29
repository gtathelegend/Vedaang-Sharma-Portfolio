import { createClient } from "@/lib/supabase/server";
import {
  mapProject,
  mapSkill,
  mapExperience,
  mapCertification,
  mapResearchPaper,
  mapResearchInterest,
  mapEducation,
} from "@/lib/supabase/mappers";

export async function getAggregatedKnowledge() {
  try {
    const supabase = await createClient();

    const [
      { data: rawProjects },
      { data: rawResearch },
      { data: rawInterests },
      { data: rawExperience },
      { data: rawSkills },
      { data: rawCerts },
      { data: rawEducation },
      { data: rawSettings },
    ] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("research_papers").select("*").order("sort_order", { ascending: true }),
      supabase.from("research_interests").select("*").order("sort_order", { ascending: true }),
      supabase.from("experience").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("name", { ascending: true }),
      supabase.from("certifications").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("start_year", { ascending: false }),
      supabase.from("settings").select("*").limit(1),
    ]);

    const projects = (rawProjects || []).map(mapProject).filter((p) => p.show !== false);
    const researchPapers = (rawResearch || []).map(mapResearchPaper);
    const researchInterests = (rawInterests || []).map(mapResearchInterest);
    const experience = (rawExperience || []).map(mapExperience);
    const skills = (rawSkills || []).map(mapSkill);
    const certifications = (rawCerts || []).map(mapCertification);
    const education = (rawEducation || []).map(mapEducation);
    const settings = (rawSettings && rawSettings[0]) || {};

    return {
      bio: {
        name: settings.full_name || "Vedaang Sharma",
        tagline: "Backend Engineer · AI Engineer · Researcher",
        subtitle:
          settings.hero_subtitle ||
          "CS student, published researcher, and full-stack engineer building AI agents, distributed systems, and cloud-native applications.",
        location: settings.location || "India",
        email: settings.email || "vedaangsharma2006@gmail.com",
        github: "https://github.com/gtathelegend",
        linkedin: "https://www.linkedin.com/in/vedaangsharma2006/",
      },
      projects,
      researchPapers,
      researchInterests,
      experience,
      skills,
      certifications,
      education,
    };
  } catch (error) {
    console.error("[knowledgeAggregator] Error retrieving knowledge:", error);
    // Fallback static knowledge structure if database connection fails
    return {
      bio: {
        name: "Vedaang Sharma",
        tagline: "Backend Engineer · AI Engineer · Researcher",
        subtitle:
          "CS student, published researcher, and full-stack engineer building AI agents, distributed systems, and computer vision architectures.",
        email: "vedaangsharma2006@gmail.com",
        github: "https://github.com/gtathelegend",
        linkedin: "https://www.linkedin.com/in/vedaangsharma2006/",
      },
      projects: [],
      researchPapers: [],
      researchInterests: [],
      experience: [],
      skills: [],
      certifications: [],
      education: [],
    };
  }
}
