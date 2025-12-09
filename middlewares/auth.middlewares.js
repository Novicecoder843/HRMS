const jwt = require("jsonwebtoken");
const { success } = require("zod");

const ignorePaths = [ "/users/adduser", 
    "/users/login","/users/bulk-insert",
    "/companies/add","/users/request-reset",  
    "/users/reset-password", ];

//Auth middileware
const authenticate = (req, res, next) => {
  try {
    if (ignorePaths.includes(req.path)){

         return next()
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }
    // implrment expiration - if token expire throw error token expiry
    
    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    req.user = decode;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    let errorMessage = "Invalid or expired token";
    if (err.name === 'TokenExpiredError') {
            errorMessage = "Token expired"; 
        }
    return res.status(401).json({
      success: false,
      message: errorMessage
    });
  }
};

module.exports = { authenticate };
