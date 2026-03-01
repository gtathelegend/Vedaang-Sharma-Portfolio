const validator = require("validator");

const allowedStatus = ["draft", "published", "archived"];

const validateProjectInput = (payload = {}, { partial = false } = {}) => {
  const errors = {};

  const missing = (field) => !partial && (payload[field] === undefined || payload[field] === null || payload[field] === "");

  if (missing("title")) {
    errors.title = "Title is required";
  }

  if (missing("year")) {
    errors.year = "Year is required";
  }

  if (payload.title !== undefined && typeof payload.title !== "string") {
    errors.title = "Title must be a string";
  }

  if (payload.year !== undefined && Number.isNaN(Number(payload.year))) {
    errors.year = "Year must be a number";
  }

  const urlFields = ["githubLink", "liveLink", "thumbnail"];
  for (const field of urlFields) {
    if (payload[field] && !validator.isURL(payload[field], { require_protocol: true })) {
      errors[field] = `${field} must be a valid URL`;
    }
  }

  if (Array.isArray(payload.images)) {
    payload.images.forEach((url, index) => {
      if (url && !validator.isURL(url, { require_protocol: true })) {
        errors[`images.${index}`] = "Image must be a valid URL";
      }
    });
  }

  if (payload.status && !allowedStatus.includes(payload.status)) {
    errors.status = "Invalid status";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateProjectInput, allowedStatus };
