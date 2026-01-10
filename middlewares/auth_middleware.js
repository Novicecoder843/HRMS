const jwt = require("jsonwebtoken");
const { success } = require("zod");

const authenticate = (req, res, next) => {
     try {
          // Read token from header
          const authHeader = req.headers.authorization;
          console.log(authHeader,'authheaferrrrrrrrrrrrrrrrrrr')
          if (!authHeader) {
               return res.status(401).json({
                    success: false,
                    message: "Token missing",
               });
          }

          //  Extract token (Bearer <token>)
          const token = authHeader.split(" ")[1];

          if (!token) {
               return res.status(401).json({
                    success: false,
                    message: "Invalid token format",
               });
          }

          //  Verify token
          const decoded = jwt.verify(
               token,
               process.env.JWT_SECRET || "secret123"
          );
          // save logged-in user info
          req.user = decoded;

          // 5 Continue to next middleware/controller
          next();
     } catch (error) {
          return res.status(401).json({
               success: false,
               message: "Invalid or expired token",
          });
     }
};

module.exports = { authenticate };
