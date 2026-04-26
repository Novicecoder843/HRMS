const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing ❌" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token ❌" });
  }
};

exports.verifyUser = (req, res, next) => {
  if (!req.user.role_id) {
    return res.status(403).json({
      message: "User token required ❌"
    });
  }
  next();
};
