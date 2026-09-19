export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vedaangsharma.in";

export const PERSON_ENTITY_ID = `${SITE_URL}/#person`;
export const WEBSITE_ENTITY_ID = `${SITE_URL}/#website`;

export const SITE_IDENTITY = {
  name: "Vedaang Sharma",
  alternateName: "Vedaang",
  jobTitle: "Full Stack Developer",
  headline: "Full Stack Developer specializing in Cloud Computing, AI/ML, and Modern Web Development",
  description:
    "Vedaang Sharma — Full Stack Developer specializing in Cloud Computing, AI/ML, backend engineering, and modern web development. BCA student in Cloud Computing & Full Stack Development at Vivekananda Global University, Jaipur.",
  url: SITE_URL,
  email: "vedaangsharma2006@gmail.com",
  defaultOgImage: `${SITE_URL}/og-image-rev.png`,
  locations: {
    primary: {
      city: "Gurugram",
      region: "Haryana",
      country: "India",
      countryCode: "IN",
    },
    academic: {
      city: "Jaipur",
      region: "Rajasthan",
      country: "India",
      countryCode: "IN",
    },
  },
  education: {
    institution: "Vivekananda Global University",
    institutionUrl: "https://vgu.ac.in",
    degree: "Bachelor of Computer Applications (BCA)",
    specialization: "Cloud Computing and Full Stack Development",
    startDate: "2024",
    endDate: "2027",
    gpa: "9.6/10",
    location: "Jaipur, Rajasthan, India",
  },
  socials: {
    github: "https://github.com/gtathelegend",
    linkedin: "https://www.linkedin.com/in/vedaangsharma2006/",
    pypi: "https://pypi.org/project/behaviorsim/",
  },
  externalProjects: [
    {
      name: "BehaviourSim",
      url: "https://behavioursim.vedaangsharma.in",
      pypiUrl: "https://pypi.org/project/behaviorsim/",
    },
    {
      name: "PostureSense",
      url: "https://posture-sense.vedaangsharma.in",
    },
    {
      name: "AEON Home",
      url: "https://github.com/gtathelegend/AEON-Home",
    },
    {
      name: "Aegis Care",
      url: "https://aegis-care.vedaangsharma.in",
    },
    {
      name: "Campus Swap",
      url: "https://campus-swap.vedaangsharma.in",
    },
  ],
  skills: [
    "Full Stack Development",
    "Cloud Computing",
    "AI/ML",
    "Generative AI",
    "Multi-Agent Systems",
    "Backend Engineering",
    "Computer Vision",
    "Next.js",
    "React",
    "Python",
    "FastAPI",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "AWS",
    "Docker",
    "REST APIs",
    "WebSockets",
  ],
};
