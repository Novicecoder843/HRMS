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
// Middleware function for create
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
const updateUserSchema = z.object({
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
}).partial(); 
//validate updateuser
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

// Login validation
const loginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const validateLoginUser = (req, res, next) => {
  try {
    loginUserSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors ? err.errors[0].message : err.message,
    });
  }
};


// Get user by ID validation
const getUserByIdSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

const validateGetUserById = (req, res, next) => {
  try {
    getUserByIdSchema.parse(req.params);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors ? err.errors[0].message : err.message,
    });
  }
};


// Bulk insert users validation
const bulkInsertSchema = z.object({
  users: z.array(
    z.object({
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
  ),
});

const validateBulkInsertUsers = (req, res, next) => {
  try {
    bulkInsertSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors ? err.errors[0].message : err.message,
    });
  }
};


// Soft delete validation
const softDeleteSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

const validateSoftDeleteUser = (req, res, next) => {
  try {
    softDeleteSchema.parse(req.params);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors ? err.errors[0].message : err.message,
    });
  }
};



module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateLoginUser,
  validateGetUserById,
  validateBulkInsertUsers,
  validateSoftDeleteUser,
};

