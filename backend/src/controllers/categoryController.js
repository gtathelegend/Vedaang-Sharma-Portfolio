const Category = require("../models/Category");
const { slugify, ensureUniqueSlug } = require("../utils/slugify");
const { sendError, sendOk } = require("../utils/http");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return sendOk(res, categories);
  } catch (error) {
    return next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 400, "Category name is required");
    }

    const baseSlug = slugify(name);
    const slug = await ensureUniqueSlug(Category, baseSlug);

    const category = await Category.create({
      name: name.trim(),
      slug,
    });

    return sendOk(res, category, 201);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
};
