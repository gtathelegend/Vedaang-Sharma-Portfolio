export function answerQuestion(query, kb) {
  if (!query || typeof query !== "string") {
    return "Please ask a question about Vedaang's portfolio, experience, projects, or research!";
  }

  const q = query.toLowerCase().trim();

  // Helper matching
  const containsAny = (...keywords) => keywords.some((k) => q.includes(k));

  /* 1. Who is Vedaang / Bio / Summary */
  if (containsAny("who is", "who's", "tell me about vedaang", "about vedaang", "introduction", "bio", "summary")) {
    return `**Vedaang Sharma** is a **Backend Engineer, AI Engineer, and Researcher**.

- **Focus Areas**: Scalable distributed backend architectures, computer vision pipelines, LLM agents, and full-stack web applications.
- **Background**: Computer Science student and active researcher with published work.
- **Key Stack**: Node.js, Python, PyTorch, Next.js, Go, PostgreSQL, Docker.

To learn more about his background and journey, visit the [About Page](/about) or check out his [Selected Work](/projects).`;
  }

  /* 2. Specific Project: Aegis Care */
  if (containsAny("aegis", "aegis care")) {
    const aegis = kb.projects.find((p) => p.slug?.includes("aegis") || p.title?.toLowerCase().includes("aegis"));
    if (aegis) {
      const desc = Array.isArray(aegis.desc) ? aegis.desc.join(" ") : aegis.desc || aegis.description || "";
      const tech = (aegis.tech || aegis.techStack || []).join(", ");
      return `### Aegis Care

**Aegis Care** is an engineering project by Vedaang Sharma.

- **Overview**: ${desc || "An intelligent healthcare & diagnostic assist application."}
- **Technologies Used**: \`${tech || "Python, Computer Vision, React, Node.js"}\`
- **Case Study**: Includes real-time monitoring and computer vision analysis.

Read the full engineering case study on the [Aegis Care Project Page](/projects/${aegis.slug || "aegis-care"}).`;
    }
    return `**Aegis Care** is an AI-powered healthcare monitoring system designed by Vedaang Sharma featuring computer vision analysis and real-time patient metrics. 

Read the full case study on the [Projects Page](/projects).`;
  }

  /* 3. Specific Project: Posture Sense */
  if (containsAny("posture", "posture sense")) {
    const posture = kb.projects.find((p) => p.slug?.includes("posture") || p.title?.toLowerCase().includes("posture"));
    if (posture) {
      const desc = Array.isArray(posture.desc) ? posture.desc.join(" ") : posture.desc || posture.description || "";
      const tech = (posture.tech || posture.techStack || []).join(", ");
      return `### Posture Sense

**Posture Sense** is an AI-driven computer vision project developed by Vedaang Sharma.

- **Overview**: ${desc || "Real-time posture tracking and ergonomic correction system using computer vision pose estimation."}
- **Tech Stack**: \`${tech || "Python, OpenCV, PyTorch, React"}\`

Check out the interactive case study on the [Posture Sense Project Page](/projects/${posture.slug || "posture-sense"}).`;
    }
    return `**Posture Sense** is a computer vision and pose-estimation application developed by Vedaang Sharma that monitors body alignment in real time and provides ergonomic feedback.

Explore all project case studies on the [Projects Page](/projects).`;
  }

  /* 4. Other Specific Projects Query */
  if (containsAny("project", "projects", "work", "case study", "built", "apps", "shipped")) {
    if (kb.projects && kb.projects.length > 0) {
      const projectList = kb.projects
        .slice(0, 5)
        .map((p) => `- **[${p.title}](/projects/${p.slug})**: ${p.description ? (Array.isArray(p.description) ? p.description[0] : p.description) : "Engineering project"}`)
        .join("\n");

      return `Vedaang has built and shipped several engineering projects across backend services, AI models, and full-stack web platforms:

${projectList}

Explore all detailed case studies on the [Projects Page](/projects).`;
    }
  }

  /* 5. Backend Technologies & Skills */
  if (containsAny("backend", "backend tech", "technology", "technologies", "tech stack", "languages", "stack", "skills", "tools")) {
    const skillsList = kb.skills && kb.skills.length > 0
      ? kb.skills.map((s) => s.name).join(", ")
      : "Node.js, Python, Go, Next.js, PostgreSQL, Redis, Docker, PyTorch, OpenCV, Supabase";

    return `### Vedaang's Technical Stack & Capabilities

- **Backend & APIs**: Node.js, Python, Go, Next.js, Express, REST APIs, gRPC
- **Data & Caching**: PostgreSQL, Redis, Supabase, SQL
- **AI & Computer Vision**: PyTorch, OpenCV, Transformers, LangChain, TensorFlow
- **Cloud & DevOps**: Docker, AWS, Vercel, Linux, CI/CD, Git
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion

Full list of technical capabilities is available on the [Skills Page](/skills).`;
  }

  /* 6. Research & Publications */
  if (containsAny("research", "paper", "papers", "published", "publication", "publications", "journal", "academic")) {
    if (kb.researchPapers && kb.researchPapers.length > 0) {
      const paperList = kb.researchPapers
        .map((p) => `- **${p.title}** (${p.venue || "Research Paper"}, ${p.year || "2024"})${p.doiUrl ? ` - [DOI / Publisher](${p.doiUrl})` : ""}`)
        .join("\n");

      return `### Published Research & Preprints

Vedaang actively conducts research at the intersection of computer vision, deep learning, and intelligent systems:

${paperList}

Read abstracts and download PDFs on the [Research & Publications Page](/research).`;
    }
    return `Vedaang conducts research focusing on computer vision models, machine learning architectures, and distributed intelligent systems.

Visit the [Research Page](/research) for full publications and preprints.`;
  }

  /* 7. Work & Internship Experience */
  if (containsAny("internship", "experience", "work history", "job", "career", "role", "company")) {
    if (kb.experience && kb.experience.length > 0) {
      const expList = kb.experience
        .map((e) => `- **${e.role || e.title}** at **${e.company || e.organization}** (${e.startDate || ""} - ${e.endDate || "Present"})\n  ${e.description || ""}`)
        .join("\n\n");

      return `### Work & Internship Experience

${expList}

View Vedaang's full career journey on the [About Page](/about).`;
    }
    return `Vedaang has experience working on full-stack web applications, AI agent systems, and backend microservices.

View his complete work journey on the [About Page](/about).`;
  }

  /* 8. Certifications & Credentials */
  if (containsAny("certification", "certifications", "credential", "license", "badge", "credly")) {
    if (kb.certifications && kb.certifications.length > 0) {
      const certList = kb.certifications
        .map((c) => `- **${c.name || c.title}** (${c.issuer || "Verified"}${c.year ? `, ${c.year}` : ""})`)
        .join("\n");

      return `### Verified Certifications & Licenses

${certList}

Verify credentials on the [Certifications Page](/certifications).`;
    }
    return `Vedaang holds verified technical credentials in software development, cloud technologies, and computer science.

Explore them on the [Certifications Page](/certifications).`;
  }

  /* 9. Resume & CV */
  if (containsAny("resume", "cv", "pdf", "download resume")) {
    return `You can view and download Vedaang Sharma's official resume directly:

📄 **[Download Resume PDF](/api/resume)**

You can also browse his detailed career timeline on the [About Page](/about) or explore his [Projects](/projects).`;
  }

  /* 10. Contact Information */
  if (containsAny("contact", "email", "reach", "hire", "message", "linkedin", "github")) {
    return `### Contact & Connect with Vedaang

- **Email**: \`${kb.bio.email}\` ([Send Email](mailto:${kb.bio.email}))
- **GitHub**: [github.com/gtathelegend](https://github.com/gtathelegend)
- **LinkedIn**: [linkedin.com/in/vedaangsharma2006](https://www.linkedin.com/in/vedaangsharma2006/)
- **Contact Form**: Send a message directly via the [Contact Page](/contact).`;
  }

  /* Strict Anti-Hallucination Fallback */
  return `I am **Ask Vedaang**, an AI assistant dedicated to answering questions about Vedaang Sharma's portfolio, software engineering projects, research, technical skills, and experience.

I don't have information about "${query}" in Vedaang's portfolio context. 

Feel free to try asking one of these suggested questions:
- *"Who is Vedaang?"*
- *"Tell me about Aegis Care."*
- *"Explain Posture Sense."*
- *"What backend technologies does he use?"*
- *"What research has he published?"*
- *"Internship experience?"*
- *"Certifications?"*
- *"Resume?"*

Or reach out directly on the [Contact Page](/contact)!`;
}
