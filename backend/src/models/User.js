const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.statics.hashPassword = function hashPassword(candidatePassword) {
  return bcrypt.hash(candidatePassword, 12);
};

module.exports = mongoose.model("User", UserSchema);
