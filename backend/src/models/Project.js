const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    githubLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true, trim: true },
    year: { type: String, default: "" },
    category: { type: [Number], default: [] },
    show: { type: Boolean, default: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
