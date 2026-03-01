const slugify = (input = "") =>
  input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueSlug = async (Model, baseSlug, excludeId = null) => {
  let slug = baseSlug || "item";
  let counter = 1;

  while (true) {
    const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    const exists = await Model.exists(query);
    if (!exists) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

module.exports = { slugify, ensureUniqueSlug };
