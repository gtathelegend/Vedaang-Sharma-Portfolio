/**
 * Centralized SEO, AEO, and GEO Configuration for Vedaang Sharma's Portfolio.
 * Serves as the single source of truth for metadata, JSON-LD schemas, and AI discovery feeds.
 */

export const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vedaangsharma.in",
  name: "Vedaang Sharma",
  legalName: "Vedaang Sharma",
  jobTitle: "Full Stack Developer",
  shortBio: "Full Stack Developer pursuing a BCA in Cloud Computing and Full Stack Development at Vivekananda Global University (2024–2027, CGPA: 9.6/10), published researcher in computer vision, and builder of AI systems.",
  fullBio: "Vedaang Sharma is a Full Stack Developer based in Gurugram, India. He specializes in designing and building high-performance web applications, computer vision models, generative AI integrations, and cloud architectures. Currently pursuing a Bachelor of Computer Applications (BCA) in Cloud Computing and Full Stack Development at Vivekananda Global University, Jaipur (2024–2027, CGPA: 9.6/10), he has published peer-reviewed research on real-time computer vision systems and engineered production-grade backend and AI solutions.",
  email: "vedaangsharma2006@gmail.com",
  location: {
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    countryCode: "IN",
  },
  socialLinks: {
    github: "https://github.com/gtathelegend",
    linkedin: "https://www.linkedin.com/in/vedaangsharma2006/",
    website: "https://vedaangsharma.in",
  },
  education: [
    {
      institution: "Vivekananda Global University",
      institutionUrl: "https://vgu.ac.in",
      location: "Jaipur, Rajasthan, India",
      degree: "Bachelor of Computer Applications (BCA)",
      fieldOfStudy: "Cloud Computing and Full Stack Development",
      startYear: "2024",
      endYear: "2027",
      status: "Currently pursuing",
      gpa: "9.6/10",
    },
    {
      institution: "Ryan International School",
      location: "Jaipur, Rajasthan, India",
      degree: "CBSE Higher Secondary Education (Class XII)",
      fieldOfStudy: "Science & Mathematics (PCM)",
      startYear: "2021",
      endYear: "2023",
      status: "Completed",
    },
  ],
  experience: [
    {
      company: "FlyRank AI",
      companyUrl: "https://flyrank.ai",
      position: "Backend AI Engineering Intern",
      type: "Internship",
      location: "Remote",
      startDate: "Jul 2026",
      endDate: "Sept 2026",
      description: "Engineered scalable backend AI services, agent orchestration pipelines, contextual RAG implementations, and high-performance inference APIs.",
      credentialId: "FR-D1-2D28F-9687E",
      verificationUrl: "https://internship.flyrank.ai/verify?id=FR-D1-2D28F-9687E&first_name=Vedaang",
      skills: ["Python", "FastAPI", "RAG", "LangChain", "Vector Databases", "LLM APIs", "System Architecture"],
    },
    {
      company: "IBM SkillsBuild",
      position: "AI Automation Intern",
      type: "Internship",
      location: "Remote",
      startDate: "Jun 2026",
      endDate: "Jul 2026",
      description: "Implemented automated AI workflows and modern interfaces adhering to performance and usability standards.",
      skills: ["AI Automation", "Python", "React", "JavaScript", "Automation Pipelines"],
    },
    {
      company: "PetsGo & PetsDoor",
      position: "Full Stack Development Intern",
      type: "Internship",
      location: "Remote",
      startDate: "Nov 2025",
      endDate: "Jan 2026",
      description: "Developed full-stack web features, designed RESTful APIs, optimized database queries, and implemented secure authentication workflows.",
      skills: ["Node.js", "Express.js", "React", "PostgreSQL", "REST APIs", "JWT Authentication"],
    },
  ],
  research: [
    {
      title: "PostureSense: Real-Time Posture Detection and Correction Using MediaPipe and Computer Vision",
      venue: "Peer-Reviewed Publication",
      year: "2024",
      projectSlug: "posturesense",
      abstract: "A real-time posture monitoring system using MediaPipe pose landmarks and computer vision, providing corrective feedback via standard webcams without wearable hardware.",
      areas: ["Computer Vision", "MediaPipe", "Pose Estimation", "Real-Time Systems", "Human-Centered AI"],
    },
  ],
  skills: {
    frontend: ["React 19", "Next.js (App Router)", "JavaScript (ESNext)", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5/CSS3", "Web Performance & Core Web Vitals"],
    backend: ["Node.js", "Express.js", "Python", "FastAPI", "RESTful APIs", "GraphQL", "WebSockets", "Authentication (OAuth, Supabase Auth)"],
    database: ["PostgreSQL", "Supabase", "Upstash Redis", "MongoDB", "SQL Optimization"],
    ai_ml: ["Computer Vision", "OpenCV", "MediaPipe", "PyTorch", "RAG Systems", "LangChain", "Prompt Engineering", "LLM Agent Orchestration"],
    devops_cloud: ["Git & GitHub", "Vercel", "Docker", "CI/CD", "PostHog Analytics", "Cloudflare Turnstile", "REST API Security"],
  },
  faqsAbout: [
    {
      question: "Who is Vedaang Sharma?",
      answer: "Vedaang Sharma is a Full Stack Developer based in Gurugram, India, pursuing a Bachelor of Computer Applications (BCA) in Cloud Computing and Full Stack Development at Vivekananda Global University, Jaipur. He specializes in full-stack web applications, AI agent systems, computer vision, and scalable backend architecture.",
    },
    {
      question: "What is Vedaang Sharma studying and where?",
      answer: "Vedaang Sharma is pursuing a Bachelor of Computer Applications (BCA) in Cloud Computing and Full Stack Development at Vivekananda Global University in Jaipur, Rajasthan, India (2024–2027) with a CGPA of 9.6/10.",
    },
    {
      question: "What are Vedaang Sharma's core technical specialties?",
      answer: "His technical specialties span Next.js, React, Node.js, Python, FastAPI, PostgreSQL/Supabase, Computer Vision (OpenCV, MediaPipe), RAG (Retrieval-Augmented Generation) architectures, and LLM agent development.",
    },
    {
      question: "Has Vedaang Sharma published academic research?",
      answer: "Yes, Vedaang Sharma has published peer-reviewed research on real-time computer vision systems, notably 'PostureSense: Real-Time Posture Detection and Correction Using MediaPipe and Computer Vision' focusing on webcam-based pose estimation without wearable sensors.",
    },
    {
      question: "What professional experience and internships does Vedaang Sharma have?",
      answer: "Vedaang Sharma has served as a Backend AI Engineering Intern at FlyRank AI (Jul 2026 – Sept 2026, verified badge credential FR-D1-2D28F-9687E), an AI Automation Intern at IBM SkillsBuild (Jun 2026 – Jul 2026), and a Full Stack Development Intern at PetsGo & PetsDoor (Nov 2025 – Jan 2026).",
    },
    {
      question: "How can I contact Vedaang Sharma for engineering roles or collaboration?",
      answer: "You can reach Vedaang Sharma directly via email at vedaangsharma2006@gmail.com, connect via LinkedIn at linkedin.com/in/vedaangsharma2006, view his code on GitHub at github.com/gtathelegend, or submit an inquiry through the contact form on his website.",
    },
  ],
};

export const SITE_URL = SITE_CONFIG.url;
export const PERSON_ENTITY_ID = `${SITE_CONFIG.url}/#person`;
export const WEBSITE_ENTITY_ID = `${SITE_CONFIG.url}/#website`;
