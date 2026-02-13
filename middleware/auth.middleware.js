const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);

    // ✅ FIX HERE
    req.user = {
      id: parseInt(decoded.id),
      role_name: decoded.role,   // map role → role_name
      email: decoded.email
    };

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
