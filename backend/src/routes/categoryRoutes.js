const express = require("express");
const { getCategories, createCategory } = require("../controllers/categoryController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getCategories);
router.post("/", auth, createCategory);

module.exports = router;
