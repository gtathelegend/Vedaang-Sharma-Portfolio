const notFound = (req, res, next) => {
  res.status(404).json({
    ok: false,
    error: {
      message: `Not Found - ${req.originalUrl}`,
    },
  });
};

const errorHandler = (err, req, res, next) => {
  void next;
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const details = err?.errors
    ? Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {})
    : null;

  res.status(statusCode).json({
    ok: false,
    error: {
      message: err.message || "Server Error",
      details,
    },
  });
};

module.exports = { notFound, errorHandler };
