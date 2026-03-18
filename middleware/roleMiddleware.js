const db = require("../config/db");

// Role-based access
exports.checkRole = (...roles) => {

 return (req, res, next) => {

  if (!roles.includes(req.user.role_id)) {
   return res.status(403).json({ message: "Access denied" });
  }

  next();

 };

};

// Permission-based
exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    try {

      const [rows] = await db.query(
        "SELECT * FROM role_permissions WHERE role_id=? AND permission_name=?",
        [req.user.role_id, permission]
      );

      console.log("USER ROLE:", req.user.role_id);
      console.log("PERMISSION:", permission);
      console.log("DB RESULT:", rows);

      if (rows.length === 0) {
        return res.status(403).json({ message: "No permission" });
      }

      next();

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};
