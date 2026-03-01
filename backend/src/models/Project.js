const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    year: { type: Number, required: true },
    description: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    images: { type: [String], default: [] },
    thumbnail: { type: String, default: "" },
    githubLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    order: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
    views: { type: Number, default: 0 },
    githubClicks: { type: Number, default: 0 },
    liveClicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ status: 1, visible: 1, order: 1 });
ProjectSchema.index({ featured: 1, order: 1 });
ProjectSchema.index({ categories: 1 });

module.exports = mongoose.model("Project", ProjectSchema);
