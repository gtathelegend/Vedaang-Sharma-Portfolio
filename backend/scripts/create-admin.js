const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../src/models/User");

dotenv.config();

const createAdmin = async () => {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD");
  }

  await mongoose.connect(MONGODB_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log("Admin user already exists");
    return;
  }

  const user = new User({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL.toLowerCase(),
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  await user.save();
  console.log("Admin user created");
};

createAdmin()
  .catch((error) => {
    console.error("Failed to create admin:", error.message);
  })
  .finally(() => {
    mongoose.connection.close();
  });
