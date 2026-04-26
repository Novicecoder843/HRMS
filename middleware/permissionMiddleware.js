const db = require("../config/db");

exports.checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const { role_id, company_id } = req.user;

      // safety
      if (!role_id || !company_id) {
        return res.status(403).json({ message: "Access denied ❌" });
      }

      const [rows] = await db.execute(
        `SELECT p.name
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ? AND rp.company_id = ?`,
        [role_id, company_id]
      );

      const permissions = rows.map(r => r.name);

      if (!permissions.includes(permissionName)) {
        return res.status(403).json({ message: "Access denied ❌" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};