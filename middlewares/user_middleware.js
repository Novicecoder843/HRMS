const { z, success } = require("zod");

//create user
const createUserSchema = z.object({
     name: z.string().min(3, "Name must be at least 3 character"),
     company_id: z.number().int("Company ID must be number"),
     email: z.string().email("Invalid email format"),
     mobile: z.string().length(10, "Mobile must be 10 digit"),
     designation: z.string().min(2, "designation required"),
     role: z.string().min(2, "role required"),
     address: z.string().optional(),
     city: z.string().optional(),
     pincode: z.string().optional(),
     password: z.string().min(6, "password must be 6 char")

});

// validate createUser

const ValidateCreateUser = (req, res, next) => {
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

// update user

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
})

const ValidateUpdateUser = (req, res, next) => {
     try {
          updateUserSchema.parse(req.body),
               next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.message || "validation failed"
          })
     }
}

module.exports = {
     ValidateCreateUser,
     ValidateUpdateUser
};