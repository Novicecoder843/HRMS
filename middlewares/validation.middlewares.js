const { z } = require("zod");

//creat user 
const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  company_id: z.string().min(1, "Company ID is required"),
  email: z.string().email("Invalid email format"),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  designation: z.string().min(2, "Designation required"),
  role: z.string().min(2, "Role required"),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Middleware function
const validateCreateUser = (req, res, next) => {
  try {
    createUserSchema.parse(req.body); // Zod validation
    next(); 
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


//updateuser
const updateUserSchema=z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
  company_id: z.string().min(1, "Company ID is required"),
  email: z.string().email("Invalid email format"),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  designation: z.string().min(2, "Designation required"),
  role: z.string().min(2, "Role required"),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

//
const validateUpdateUser =(req,res,next)=>{
try {
    updateUserSchema.parse(req.body);
    next();
} catch (err) {
    return res.status(400).json({
        success: false,
      message: err.message || "Validation failed",
    })
}
}

module.exports = {
  validateCreateUser,
  validateUpdateUser
};
