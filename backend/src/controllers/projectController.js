const Project = require("../models/Project");
const { validateProjectInput } = require("../utils/validation");
const { slugify, ensureUniqueSlug } = require("../utils/slugify");
const { sendError, sendOk } = require("../utils/http");
const { ANALYTICS_FIELDS } = require("../utils/constants");

const formatProject = (project) => {
  const data = project.toObject();
  return {
    ...data,
    desc: data.description || [],
    tech: data.techStack || [],
    code: data.githubLink || "",
    preview: data.liveLink || "",
    show: data.visible,
  };
};

const normalizeProjectInput = (body = {}, { partial = false } = {}) => {
  const payload = {};

  // Keep backward compatibility for old admin field names while preserving partial updates.
  if (body.title !== undefined) payload.title = body.title;
  if (body.year !== undefined) payload.year = body.year;
  if (body.description !== undefined || body.desc !== undefined) payload.description = body.description ?? body.desc;
  if (body.techStack !== undefined || body.tech !== undefined) payload.techStack = body.techStack ?? body.tech;
  if (body.categories !== undefined || body.category !== undefined) payload.categories = body.categories ?? body.category;
  if (body.images !== undefined) payload.images = body.images;
  if (body.thumbnail !== undefined) payload.thumbnail = body.thumbnail;
  if (body.githubLink !== undefined || body.code !== undefined) payload.githubLink = body.githubLink ?? body.code;
  if (body.liveLink !== undefined || body.preview !== undefined) payload.liveLink = body.liveLink ?? body.preview;
  if (body.featured !== undefined) payload.featured = body.featured;
  if (body.visible !== undefined || body.show !== undefined) payload.visible = body.visible ?? body.show;
  if (body.status !== undefined) payload.status = body.status;
  if (body.order !== undefined) payload.order = body.order;
  if (body.seo !== undefined) {
    payload.seo = {
      metaTitle: body?.seo?.metaTitle ?? "",
      metaDescription: body?.seo?.metaDescription ?? "",
    };
  }

  if (!partial) {
    if (payload.description === undefined) payload.description = [];
    if (payload.techStack === undefined) payload.techStack = [];
    if (payload.categories === undefined) payload.categories = [];
    if (payload.images === undefined) payload.images = [];
    if (payload.thumbnail === undefined) payload.thumbnail = "";
    if (payload.githubLink === undefined) payload.githubLink = "";
    if (payload.liveLink === undefined) payload.liveLink = "";
    if (payload.featured === undefined) payload.featured = false;
    if (payload.visible === undefined) payload.visible = true;
    if (payload.status === undefined) payload.status = "draft";
    if (payload.order === undefined) payload.order = 0;
    if (payload.seo === undefined) {
      payload.seo = {
        metaTitle: "",
        metaDescription: "",
      };
    }
  }

  return payload;
};

const getProjects = async (req, res, next) => {
  try {
    const { status, featured, visible, category, q, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === "true";
    if (visible !== undefined) filter.visible = visible === "true";
    if (category) filter.categories = category;
    if (q) filter.title = { $regex: q, $options: "i" };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate("categories", "name slug")
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Project.countDocuments(filter),
    ]);

    return sendOk(res, {
      items: projects.map(formatProject),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate("categories", "name slug");
    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    return sendOk(res, formatProject(project));
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const payload = normalizeProjectInput(req.body, { partial: false });
    const { valid, errors } = validateProjectInput(payload);
    if (!valid) {
      return sendError(res, 400, "Validation failed", errors);
    }

    const baseSlug = slugify(req.body.slug || payload.title);
    payload.slug = await ensureUniqueSlug(Project, baseSlug);
    payload.year = Number(payload.year);
    payload.techStack = [...new Set((payload.techStack || []).map((item) => String(item).trim()).filter(Boolean))];

    const project = await Project.create(payload);
    return sendOk(res, formatProject(project), 201);
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const payload = normalizeProjectInput(req.body, { partial: true });
    const { valid, errors } = validateProjectInput(payload, { partial: true });
    if (!valid) {
      return sendError(res, 400, "Validation failed", errors);
    }

    if (req.body.slug || payload.title) {
      const baseSlug = slugify(req.body.slug || payload.title);
      payload.slug = await ensureUniqueSlug(Project, baseSlug, req.params.id);
    }

    if (payload.year !== undefined) {
      payload.year = Number(payload.year);
    }

    payload.techStack = [...new Set((payload.techStack || []).map((item) => String(item).trim()).filter(Boolean))];

    const project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    return sendOk(res, formatProject(project));
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return sendError(res, 404, "Project not found");
    }
    return sendOk(res, { id: req.params.id, deleted: true });
  } catch (error) {
    return next(error);
  }
};

const reorderProjects = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || !orderedIds.length) {
      return sendError(res, 400, "orderedIds array is required");
    }

    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await Project.bulkWrite(operations);
    return sendOk(res, { updated: orderedIds.length });
  } catch (error) {
    return next(error);
  }
};

const incrementProjectAnalytics = async (req, res, next) => {
  try {
    const { type } = req.body;
    const field = ANALYTICS_FIELDS[type];
    if (!field) {
      return sendError(res, 400, "Invalid analytics type");
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { [field]: 1 } },
      { new: true }
    ).select("views githubClicks liveClicks");

    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    return sendOk(res, project);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  incrementProjectAnalytics,
};
