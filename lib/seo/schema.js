import { SITE_CONFIG } from "./config";

/**
 * Returns structured JSON-LD for the primary Person entity (Vedaang Sharma).
 */
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.name,
    alternateName: ["Vedaang", "Vedaang Sharma Portfolio"],
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}/og-image-rev.png`,
    jobTitle: SITE_CONFIG.jobTitle,
    description: SITE_CONFIG.shortBio,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: SITE_CONFIG.location.country,
    },
    alumniOf: SITE_CONFIG.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      ...(edu.institutionUrl ? { url: edu.institutionUrl } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: edu.location,
      },
    })),
    worksFor: SITE_CONFIG.experience.map((exp) => ({
      "@type": "Organization",
      name: exp.company,
      ...(exp.companyUrl ? { url: exp.companyUrl } : {}),
    })),
    sameAs: [
      SITE_CONFIG.socialLinks.github,
      SITE_CONFIG.socialLinks.linkedin,
    ],
    knowsAbout: Object.values(SITE_CONFIG.skills).flat(),
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "FlyRank AI Backend AI Engineering Internship Credential",
        credentialCategory: "Internship Verification",
        recognizedBy: {
          "@type": "Organization",
          name: "FlyRank AI",
          url: "https://flyrank.ai",
        },
        identifier: "FR-D1-2D28F-9687E",
        url: "https://internship.flyrank.ai/verify?id=FR-D1-2D28F-9687E&first_name=Vedaang",
      },
    ],
  };
}

/**
 * Returns structured JSON-LD for the WebSite entity.
 * Note: SearchAction is omitted because search is handled in-page rather than via dedicated query URLs.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.shortBio,
    author: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
    publisher: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
  };
}

/**
 * Returns ProfilePage schema linking directly to the main Person entity.
 */
export function getProfilePageSchema(pagePath = "/about", title = "About Vedaang Sharma", description = SITE_CONFIG.shortBio) {
  const pageUrl = `${SITE_CONFIG.url}${pagePath}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}/#profile`,
    url: pageUrl,
    name: title,
    description: description,
    mainEntity: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
  };
}

/**
 * Returns FAQPage schema for pages containing visible FAQ content.
 * Strictly compliant with Google guidelines: only used where questions/answers are visible to users.
 */
export function getFAQPageSchema(faqs = []) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Returns ItemList schema for catalog pages (Projects, Certifications, Blog).
 */
export function getItemListSchema({ name, description, path = "", items = [] }) {
  const listUrl = `${SITE_CONFIG.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: name,
    description: description,
    url: listUrl,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name || item.title,
      url: item.url?.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url || item.path || ""}`,
      ...(item.description || item.desc ? { description: Array.isArray(item.description || item.desc) ? (item.description || item.desc)[0] : (item.description || item.desc) } : {}),
    })),
  };
}

/**
 * Returns EducationalOccupationalCredential schema for a certification item.
 */
export function getEducationalOccupationalCredentialSchema(cert) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: cert.name,
    credentialCategory: cert.category || "Professional Certification",
    ...(cert.issuer
      ? {
          recognizedBy: {
            "@type": "Organization",
            name: cert.issuer,
          },
        }
      : {}),
    ...(cert.url ? { url: cert.url } : {}),
  };
}

/**
 * Returns BreadcrumbList schema for navigation paths.
 */
export function getBreadcrumbListSchema(crumbs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${SITE_CONFIG.url}${crumb.url}`,
    })),
  };
}

export const getBreadcrumbSchema = getBreadcrumbListSchema;

/**
 * Returns SoftwareApplication schema for project pages.
 */
export function getSoftwareApplicationSchema(project) {
  if (!project) return null;
  const projectUrl = `${SITE_CONFIG.url}/projects/${project.slug}`;
  const techStack = Array.isArray(project.tech_stack || project.techStack)
    ? (project.tech_stack || project.techStack)
    : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${projectUrl}#software`,
    name: project.title,
    url: projectUrl,
    description:
      project.seo_desc ||
      (Array.isArray(project.description) ? project.description.join(" ") : project.description) ||
      `${project.title} by ${SITE_CONFIG.name}`,
    applicationCategory: project.category || "DeveloperApplication",
    operatingSystem: "Web, Cross-Platform",
    author: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
  };

  if (project.thumbnail) {
    schema.image = project.thumbnail.startsWith("http")
      ? project.thumbnail
      : `${SITE_CONFIG.url}${project.thumbnail}`;
  }

  if (project.live_link || project.liveLink) {
    schema.sameAs = [project.live_link || project.liveLink];
  }

  if (project.github_link || project.githubLink) {
    schema.downloadUrl = project.github_link || project.githubLink;
    schema.codeRepository = project.github_link || project.githubLink;
  }

  if (techStack.length > 0) {
    schema.programmingLanguage = techStack.map((tech) =>
      typeof tech === "string" ? tech : tech.name || ""
    ).filter(Boolean);
  }

  return schema;
}

/**
 * Returns ScholarlyArticle schema for research papers.
 */
export function getScholarlyArticleSchema(paper) {
  if (!paper) return null;
  const paperUrl = `${SITE_CONFIG.url}/research/${paper.project_slug || paper.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${paperUrl}#article`,
    headline: paper.title,
    name: paper.title,
    url: paperUrl,
    description: paper.abstract || `${paper.title} — Research publication by ${SITE_CONFIG.name}`,
    author: [
      {
        "@type": "Person",
        "@id": `${SITE_CONFIG.url}/#person`,
        name: SITE_CONFIG.name,
      },
    ],
    publisher: paper.venue
      ? {
          "@type": "Organization",
          name: paper.venue,
        }
      : undefined,
    datePublished: paper.year ? `${paper.year}` : undefined,
    mainEntityOfPage: paperUrl,
  };
}

/**
 * Returns BlogPosting schema for blog posts.
 */
export function getBlogPostingSchema(post) {
  if (!post) return null;
  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    name: post.title,
    url: postUrl,
    description: post.excerpt || `${post.title} by ${SITE_CONFIG.name}`,
    author: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.name,
    },
    datePublished: post.published_at || post.created_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    mainEntityOfPage: postUrl,
    image: post.cover_image
      ? post.cover_image.startsWith("http")
        ? post.cover_image
        : `${SITE_CONFIG.url}${post.cover_image}`
      : `${SITE_CONFIG.url}/og-image-rev.png`,
  };
}
