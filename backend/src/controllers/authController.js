const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendError, sendOk } = require("../utils/http");

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24,
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid credentials");
    }

    const token = auth.signAuthToken(user);

    res.cookie(auth.TOKEN_COOKIE_NAME, token, buildCookieOptions());

    return sendOk(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res) => {
  res.cookie(auth.TOKEN_COOKIE_NAME, "", {
    ...buildCookieOptions(),
    maxAge: 0,
  });
  return sendOk(res, { message: "Logged out" });
};

const me = async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized");
  }

  return sendOk(res, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { login, logout, me };
