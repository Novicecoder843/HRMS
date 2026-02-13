const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role_name;

      if (!userRole) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Convert to array if single string
      if (!Array.isArray(allowedRoles)) {
        allowedRoles = [allowedRoles];
      }

      // Normalize roles to lowercase
      const normalizedAllowedRoles = allowedRoles.map(role =>
        String(role).toLowerCase()
      );

      if (!normalizedAllowedRoles.includes(userRole.toLowerCase())) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = roleMiddleware;
