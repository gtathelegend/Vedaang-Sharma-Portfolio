const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // Reuse the same mongoose connection between hot reloads/serverless invocations.
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  cachedConnection = await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
  });

  console.log("MongoDB connected");
  return cachedConnection;
};

module.exports = connectDB;
