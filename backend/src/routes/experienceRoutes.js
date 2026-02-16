const express = require("express");
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getExperience);
router.post("/", auth, createExperience);
router.put("/:id", auth, updateExperience);
router.delete("/:id", auth, deleteExperience);

module.exports = router;
