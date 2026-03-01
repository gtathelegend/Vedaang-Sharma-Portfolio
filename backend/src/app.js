const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const socialRoutes = require("./routes/socialRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length
  ? { origin: allowedOrigins, credentials: true }
  : {
      origin: true,
      credentials: true,
    };

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/socials", socialRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
