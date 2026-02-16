const express = require("express");
const {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
} = require("../controllers/socialController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getSocials);
router.post("/", auth, createSocial);
router.put("/:id", auth, updateSocial);
router.delete("/:id", auth, deleteSocial);

module.exports = router;
