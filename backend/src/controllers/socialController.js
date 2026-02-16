const SocialLink = require("../models/SocialLink");

const getSocials = async (req, res, next) => {
  try {
    const socials = await SocialLink.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ data: socials });
  } catch (error) {
    next(error);
  }
};

const createSocial = async (req, res, next) => {
  try {
    const social = await SocialLink.create(req.body);
    res.status(201).json({ data: social });
  } catch (error) {
    next(error);
  }
};

const updateSocial = async (req, res, next) => {
  try {
    const social = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!social) {
      res.status(404);
      return next(new Error("Social link not found"));
    }
    return res.json({ data: social });
  } catch (error) {
    return next(error);
  }
};

const deleteSocial = async (req, res, next) => {
  try {
    const social = await SocialLink.findByIdAndDelete(req.params.id);
    if (!social) {
      res.status(404);
      return next(new Error("Social link not found"));
    }
    return res.json({ message: "Social link removed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
};
