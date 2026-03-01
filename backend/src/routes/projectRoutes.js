const express = require("express");
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  incrementProjectAnalytics,
} = require("../controllers/projectController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
router.patch("/reorder", auth, reorderProjects);
router.post("/:id/analytics", incrementProjectAnalytics);

module.exports = router;
