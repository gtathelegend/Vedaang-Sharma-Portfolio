const Education = require("../models/Education");

const getEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ createdAt: -1 });
    res.json({ data: education });
  } catch (error) {
    next(error);
  }
};

const createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ data: education });
  } catch (error) {
    next(error);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!education) {
      res.status(404);
      return next(new Error("Education not found"));
    }
    return res.json({ data: education });
  } catch (error) {
    return next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      res.status(404);
      return next(new Error("Education not found"));
    }
    return res.json({ message: "Education removed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
