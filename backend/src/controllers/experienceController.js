const Experience = require("../models/Experience");

const formatExperience = (experience) => {
  const data = experience.toObject();
  return {
    ...data,
    position: data.role,
  };
};

const getExperience = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ sortOrder: -1, createdAt: -1 });
    res.json({ data: experiences.map(formatExperience) });
  } catch (error) {
    next(error);
  }
};

const createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ data: formatExperience(experience) });
  } catch (error) {
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!experience) {
      res.status(404);
      return next(new Error("Experience not found"));
    }
    return res.json({ data: formatExperience(experience) });
  } catch (error) {
    return next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      res.status(404);
      return next(new Error("Experience not found"));
    }
    return res.json({ message: "Experience removed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};
