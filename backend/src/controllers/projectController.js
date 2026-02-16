const Project = require("../models/Project");

const formatProject = (project) => {
  const data = project.toObject();
  return {
    ...data,
    desc: data.description || [],
    tech: data.techStack || [],
    code: data.githubLink || "",
    preview: data.liveLink || "",
    thumbnail: data.imageUrl || "",
  };
};

const normalizeProjectInput = (body) => {
  const description = body.description ?? body.desc ?? [];
  const techStack = body.techStack ?? body.tech ?? [];
  const githubLink = body.githubLink ?? body.code ?? "";
  const liveLink = body.liveLink ?? body.preview ?? "";
  const imageUrl = body.imageUrl ?? body.thumbnail ?? "";

  return {
    title: body.title,
    description,
    techStack,
    githubLink,
    liveLink,
    imageUrl,
    featured: body.featured ?? false,
    slug: body.slug,
    year: body.year ?? "",
    category: body.category ?? [],
    show: body.show ?? true,
    images: body.images ?? [],
  };
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ data: projects.map(formatProject) });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const payload = normalizeProjectInput(req.body);
    const project = await Project.create(payload);
    res.status(201).json({ data: formatProject(project) });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const payload = normalizeProjectInput(req.body);
    const project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      res.status(404);
      return next(new Error("Project not found"));
    }
    return res.json({ data: formatProject(project) });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error("Project not found"));
    }
    return res.json({ message: "Project removed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
