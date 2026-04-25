export function mapProject(row) {
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    slug: row.slug,
    year: row.year,
    description: row.description,
    desc: row.description,
    techStack: row.tech_stack,
    tech: row.tech_stack,
    category: row.category,
    thumbnail: row.thumbnail,
    imageUrl: row.thumbnail,
    githubLink: row.github_link,
    code: row.github_link,
    liveLink: row.live_link,
    preview: row.live_link,
    images: row.images,
    featured: row.featured,
    show: row.show,
    visible: row.show,
    status: row.status,
    sort_order: row.sort_order,
  };
}

export function mapSkill(row) {
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    category: row.category,
    level: row.level,
  };
}

export function mapEducation(row) {
  return {
    id: row.id,
    _id: row.id,
    institute: row.institute,
    degree: row.degree,
    startYear: row.start_year,
    endYear: row.end_year,
    summary: row.summary,
    gpa: row.gpa,
    images: row.images,
    achievements: row.achievements,
  };
}

export function mapExperience(row) {
  return {
    id: row.id,
    _id: row.id,
    company: row.company,
    role: row.role,
    position: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    type: row.type,
    location: row.location,
    skills: row.skills,
    sortOrder: row.sort_order,
  };
}

export function mapSocial(row) {
  return {
    id: row.id,
    _id: row.id,
    platform: row.platform,
    url: row.url,
    iconName: row.icon_name,
    sortOrder: row.sort_order,
  };
}
