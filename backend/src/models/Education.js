const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    date: { type: String, required: true },
    color: { type: String, default: "from-gray-400 to-gray-600" },
    iconName: { type: String, default: "faAward" },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    institute: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    summary: { type: String, default: "" },
    gpa: { type: String, default: "" },
    images: { type: [String], default: [] },
    achievements: { type: [AchievementSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", EducationSchema);
