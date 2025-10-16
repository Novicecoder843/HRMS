// src/middleware/error.middleware.js

function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
