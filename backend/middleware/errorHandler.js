const errorHandler = (err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({
    status: "Error",
    code: "SERVER_ERROR",
    message: "An unexpected error occurred",
  });
};

module.exports = errorHandler;
