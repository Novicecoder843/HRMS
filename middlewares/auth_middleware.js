const jwt = require("jsonwebtoken");
const { success } = require("zod");


const ignorePaths = ["/users/adduser", "/role/create",
     "/users/login", "/users/bulk-insert",
     "/companies/add", "/users/request-reset",
     "/users/reset-password","/leave/add-type"];


// AUTH MIDDLEWARE
const authenticate = (req, res, next) => {
     try {
          // Skip public routes
          if (ignorePaths.includes(req.path)) {
               return next();
          }

          // Read Authorization header
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
               return res.status(401).json({
                    success: false,
                    message: "Authorization token missing",
               });
          }

          // Extract token
          const token = authHeader.split(" ")[1];

          // Verify token
          const decoded = jwt.verify(
               token,
               process.env.JWT_SECRET || "secret123"
          );

          // Attach user to request
          req.user = decoded; // ✅ contains company_id

          next(); // ✅ success path
     } catch (err) {
          console.error("JWT Error:", err.message);

          return res.status(401).json({
               success: false,
               message:
                    err.name === "TokenExpiredError"
                         ? "Token expired"
                         : "Invalid or expired token",
          });
     }
};

module.exports = { authenticate };
