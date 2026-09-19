import { aggregateKnowledge } from "@/lib/knowledge/aggregate";

/**
 * Legacy wrapper for getAggregatedKnowledge.
 * Uses dynamic knowledge aggregator module (lib/knowledge/aggregate.ts).
 */
export async function getAggregatedKnowledge() {
  const result = await aggregateKnowledge();

  if (result.success) {
    return result;
  }

  // Fallback structured error response with empty default collections
  return {
    success: false,
    error: result.error,
    bio: {
      name: "Vedaang Sharma",
      tagline: "Full Stack Developer • AI Engineer • Researcher",
      subtitle:
        "Full Stack Developer pursuing a BCA in Cloud Computing and Full Stack Development at Vivekananda Global University, published researcher, and builder of AI systems.",
      location: "Gurugram, Haryana, India",
      email: "vedaangsharma2006@gmail.com",
      github: "https://github.com/gtathelegend",
      linkedin: "https://www.linkedin.com/in/vedaangsharma2006/",
    },
    records: [],
    byType: {
      project: [],
      research: [],
      skill: [],
      certification: [],
      experience: [],
      education: [],
      blog: [],
      resume: [],
      settings: [],
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
