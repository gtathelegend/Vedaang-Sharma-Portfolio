const express = require("express");
const {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getEducation);
router.post("/", auth, createEducation);
router.put("/:id", auth, updateEducation);
router.delete("/:id", auth, deleteEducation);

module.exports = router;
