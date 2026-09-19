import {
  SITE_URL,
  PERSON_ENTITY_ID,
  WEBSITE_ENTITY_ID,
  SITE_IDENTITY,
} from "./config";

/**
 * Generates the canonical Person entity JSON-LD for Vedaang Sharma.
 */
export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ENTITY_ID,
    name: SITE_IDENTITY.name,
    alternateName: SITE_IDENTITY.alternateName,
    url: SITE_URL,
    image: SITE_IDENTITY.defaultOgImage,
    jobTitle: SITE_IDENTITY.jobTitle,
    description: SITE_IDENTITY.description,
    email: `mailto:${SITE_IDENTITY.email}`,
    sameAs: [
      SITE_IDENTITY.socials.github,
      SITE_IDENTITY.socials.linkedin,
      SITE_IDENTITY.socials.pypi,
      ...SITE_IDENTITY.externalProjects.map((p) => p.url).filter(Boolean),
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: SITE_IDENTITY.locations.primary.city,
        addressRegion: SITE_IDENTITY.locations.primary.region,
        addressCountry: SITE_IDENTITY.locations.primary.countryCode,
      },
      {
        "@type": "PostalAddress",
        addressLocality: SITE_IDENTITY.locations.academic.city,
        addressRegion: SITE_IDENTITY.locations.academic.region,
        addressCountry: SITE_IDENTITY.locations.academic.countryCode,
      },
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: SITE_IDENTITY.education.institution,
      url: SITE_IDENTITY.education.institutionUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_IDENTITY.locations.academic.city,
        addressRegion: SITE_IDENTITY.locations.academic.region,
        addressCountry: SITE_IDENTITY.locations.academic.countryCode,
      },
    },
    knowsAbout: SITE_IDENTITY.skills,
  };
}

/**
 * Generates WebSite JSON-LD.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ENTITY_ID,
    name: SITE_IDENTITY.name,
    url: SITE_URL,
    description: SITE_IDENTITY.description,
    publisher: {
      "@id": PERSON_ENTITY_ID,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates ProfilePage JSON-LD for /about.
 */
export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profilepage`,
    url: `${SITE_URL}/about`,
    name: `About ${SITE_IDENTITY.name}`,
    description: `Professional background, education, and technical experience of ${SITE_IDENTITY.name}.`,
    mainEntity: {
      "@id": PERSON_ENTITY_ID,
    },
  };
}

/**
 * Generates BreadcrumbList JSON-LD.
 * @param {Array<{ name: string, url: string }>} items
 */
export function getBreadcrumbSchema(items = []) {
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates SoftwareApplication / CreativeWork JSON-LD for project pages.
 */
export function getSoftwareApplicationSchema(project) {
  if (!project) return null;

  const projectUrl = `${SITE_URL}/projects/${project.slug}`;
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
      `${project.title} by ${SITE_IDENTITY.name}`,
    applicationCategory: project.category || "DeveloperApplication",
    operatingSystem: "Web, Cross-Platform",
    author: {
      "@id": PERSON_ENTITY_ID,
    },
  };

  if (project.thumbnail) {
    schema.image = project.thumbnail.startsWith("http")
      ? project.thumbnail
      : `${SITE_URL}${project.thumbnail}`;
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
 * Generates ScholarlyArticle JSON-LD for research publications.
 */
export function getScholarlyArticleSchema(paper) {
  if (!paper) return null;

  const paperUrl = `${SITE_URL}/research/${paper.project_slug || paper.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${paperUrl}#article`,
    headline: paper.title,
    name: paper.title,
    url: paperUrl,
    description: paper.abstract || `${paper.title} — Research publication by ${SITE_IDENTITY.name}`,
    author: [
      {
        "@type": "Person",
        "@id": PERSON_ENTITY_ID,
        name: SITE_IDENTITY.name,
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
 * Generates BlogPosting JSON-LD for technical articles.
 */
export function getBlogPostingSchema(post) {
  if (!post) return null;

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    name: post.title,
    url: postUrl,
    description: post.excerpt || `${post.title} by ${SITE_IDENTITY.name}`,
    author: {
      "@type": "Person",
      "@id": PERSON_ENTITY_ID,
      name: SITE_IDENTITY.name,
    },
    publisher: {
      "@type": "Person",
      "@id": PERSON_ENTITY_ID,
      name: SITE_IDENTITY.name,
    },
    datePublished: post.published_at || post.created_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    mainEntityOfPage: postUrl,
    image: post.cover_image
      ? post.cover_image.startsWith("http")
        ? post.cover_image
        : `${SITE_URL}${post.cover_image}`
      : SITE_IDENTITY.defaultOgImage,
  };
}
