export function answerQuestion(query, kb) {
  if (!query || typeof query !== "string") {
    return "Please ask a question about Vedaang's portfolio, experience, projects, or research!";
  }

  const q = query.toLowerCase().trim();
  const containsAny = (...keywords) => keywords.some((k) => q.includes(k));

  /* 1. Dynamic Match: Specific Project from CMS */
  const matchedProject = kb.projects?.find((p) => {
    const title = (p.title || "").toLowerCase();
    const slug = (p.slug || "").toLowerCase();
    return title.includes(q) || slug.includes(q) || q.includes(title) || (slug && q.includes(slug));
  });

  if (matchedProject) {
    const title = matchedProject.title || "Project";
    const slug = matchedProject.slug || "";
    const desc = Array.isArray(matchedProject.desc || matchedProject.description)
      ? (matchedProject.desc || matchedProject.description).join(" ")
      : matchedProject.desc || matchedProject.description || "";
    const tech = (matchedProject.tech || matchedProject.techStack || []).join(", ");
    const problem = matchedProject.problemStatement || matchedProject.problem;
    const decisions = matchedProject.engineeringDecisions || matchedProject.decisions;
    const github = matchedProject.githubLink || matchedProject.code || matchedProject.githubUrl;
    const demo = matchedProject.liveLink || matchedProject.preview || matchedProject.demoUrl;

    return `### ${title}

${desc}

- **Core Technologies**: \`${tech || "Full Stack"}\`
${problem ? `- **Problem Solved**: ${problem}\n` : ""}${decisions ? `- **Engineering Decisions**: ${decisions}\n` : ""}${github ? `- **Repository**: [GitHub Source Code](${github})\n` : ""}${demo ? `- **Live App**: [View Live Demo](${demo})\n` : ""}
Read the full engineering case study on the [${title} Project Page](/projects/${slug}).`;
  }

  /* 2. Who is Vedaang / Bio / Summary */
  if (containsAny("who is", "who's", "tell me about vedaang", "about vedaang", "introduction", "bio", "summary", "background")) {
    return `**${kb.bio.name}** is a **${kb.bio.tagline}**.

${kb.bio.subtitle}

- **Email**: \`${kb.bio.email}\`
- **Location**: ${kb.bio.location}
- **GitHub**: [github.com/gtathelegend](${kb.bio.github})
- **LinkedIn**: [linkedin.com/in/vedaangsharma2006](${kb.bio.linkedin})

Learn more about his journey on the [About Page](/about) or explore his [Selected Work](/projects).`;
  }

  /* 3. Projects Catalog Query */
  if (containsAny("project", "projects", "work", "case study", "case studies", "built", "apps", "shipped")) {
    if (kb.projects && kb.projects.length > 0) {
      const projectList = kb.projects
        .slice(0, 6)
        .map((p) => {
          const descSnippet = Array.isArray(p.description)
            ? p.description[0]
            : (p.description || p.desc || "Engineering case study");
          return `- **[${p.title}](/projects/${p.slug})**: ${descSnippet}`;
        })
        .join("\n");

      return `Vedaang has shipped several production engineering projects:

${projectList}

Explore all detailed case studies on the [Projects Page](/projects).`;
    }
  }

  /* 4. Research & Publications Query */
  if (containsAny("research", "paper", "papers", "published", "publication", "publications", "journal", "academic")) {
    if (kb.researchPapers && kb.researchPapers.length > 0) {
      const paperList = kb.researchPapers
        .map((p) => `- **${p.title}** (${p.venue || "Peer-Reviewed Paper"}, ${p.year || "2024"})${p.doiUrl ? ` - [DOI Link](${p.doiUrl})` : ""}`)
        .join("\n");

      return `### Published Research & Preprints

Vedaang actively conducts computer science and AI research:

${paperList}

Read abstracts and download PDFs on the [Research Page](/research).`;
    }
  }

  /* 5. Backend & Technical Skills Query */
  if (containsAny("backend", "technology", "technologies", "tech stack", "languages", "stack", "skills", "tools", "database", "python", "node")) {
    const skillsList = (kb.skills || []).map((s) => s.name).join(", ");
    return `### Technical Stack & Skills

- **Core Capabilities**: ${skillsList || "Node.js, Python, Go, Next.js, PostgreSQL, Redis, Docker, PyTorch, OpenCV, Supabase"}
- **Backend & APIs**: Scalable REST & gRPC microservices, PostgreSQL, Redis caching
- **AI & Vision**: PyTorch, OpenCV, Transformers, LangChain

View full competency matrix on the [Skills Page](/skills).`;
  }

  /* 6. Experience & Internships */
  if (containsAny("internship", "experience", "work history", "job", "career", "role", "company")) {
    if (kb.experience && kb.experience.length > 0) {
      const expList = kb.experience
        .map((e) => `- **${e.role || e.position || e.title}** at **${e.company || e.organization}** (${e.startDate || ""} - ${e.endDate || "Present"})\n  ${e.description || ""}`)
        .join("\n\n");

      return `### Work & Experience History

${expList}

Explore full career timeline on the [About Page](/about).`;
    }
  }

  /* 7. Certifications */
  if (containsAny("certification", "certifications", "credential", "license", "badge")) {
    if (kb.certifications && kb.certifications.length > 0) {
      const certList = kb.certifications
        .map((c) => `- **${c.name || c.title}** (${c.issuer || "Verified"}${c.year ? `, ${c.year}` : ""})`)
        .join("\n");

      return `### Verified Certifications

${certList}

Explore them on the [Certifications Page](/certifications).`;
    }
  }

  /* 8. Resume */
  if (containsAny("resume", "cv", "pdf")) {
    return `Download Vedaang's official resume directly:

📄 **[Download Resume PDF](/api/resume)**`;
  }

  /* 9. Contact */
  if (containsAny("contact", "email", "reach", "hire", "message", "linkedin", "github")) {
    return `### Contact Vedaang

- **Email**: \`${kb.bio.email}\` ([Send Email](mailto:${kb.bio.email}))
- **GitHub**: [github.com/gtathelegend](${kb.bio.github})
- **LinkedIn**: [linkedin.com/in/vedaangsharma2006](${kb.bio.linkedin})
- **Contact Form**: [Send Message](/contact)`;
  }

  /* Grounded Fallback */
  return `I am **Ask Vedaang**, an AI assistant dedicated to answering questions about Vedaang Sharma's portfolio content.

I don't have information about "${query}" in Vedaang's portfolio context.

Try asking about:
- *"Who is Vedaang?"*
- Any project title (e.g. *"Tell me about Aegis Care"*)
- *"What research has he published?"*
- *"What backend technologies does he use?"*
- *"Resume"* or *"Contact"*`;
}
