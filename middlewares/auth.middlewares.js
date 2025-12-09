const jwt = require("jsonwebtoken");
const { success } = require("zod");

const ignorePaths = [ "/users/adduser", 
    "/users/login",
    "/companies/add", ];

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
    console.log(err)
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authenticate };
