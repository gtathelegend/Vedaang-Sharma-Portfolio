const sendError = (res, status, message, details = null) =>
  res.status(status).json({
    ok: false,
    error: {
      message,
      details,
    },
  });

const sendOk = (res, data = {}, status = 200) =>
  res.status(status).json({
    ok: true,
    data,
  });

module.exports = {
  sendError,
  sendOk,
};
