const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/http");

const TOKEN_COOKIE_NAME = "admin_token";

// Read signed JWT from the httpOnly cookie set by the login route.
const getTokenFromRequest = (req) => req.cookies?.[TOKEN_COOKIE_NAME] || null;

const signAuthToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

const auth = async (req, res, next) => {
  // Route protection middleware for all write/admin endpoints.
  const token = getTokenFromRequest(req);
  if (!token) {
    return sendError(res, 401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return sendError(res, 401, "Unauthorized");
    }
    req.user = user;
    return next();
  } catch (error) {
    return sendError(res, 401, "Invalid or expired token");
  }
};

auth.TOKEN_COOKIE_NAME = TOKEN_COOKIE_NAME;
auth.signAuthToken = signAuthToken;

module.exports = auth;
