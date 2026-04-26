exports.validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,   // 🔥 show all errors
      stripUnknown: true   // 🔥 remove unwanted fields
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map(e => e.message)
      });
    }

    // ✅ Clean data (important)
    req.body = value;

    next();
  };
};