const { z, success } = require("zod");

//create user
const createUserSchema = z.object({
     name: z.string().min(3, "Name must be at least 3 character"),
     company_id: z.coerce.number().int("Company ID must be number"),
     email: z.string().email("Invalid email format"),
     mobile: z.string().length(10, "Mobile must be 10 digit"),
     designation: z.string().min(2, "designation required"),
     role: z.coerce.number().optional(),
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
          // console.log(typeof err.message, err.message) // ✅ exact message
          return res.status(400).json({
               success: false,
               errors: err.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
               }))
          });
          return res.status(400).json({
               success: false,
               message: err,
          });
     }
};

// read user
const readUserSchema = z.object({
     name: z.string().min(3, "Name must be at least 3 character"),
     company_id: z.coerce.number().int("Company ID must be number"),
     email: z.string().email("Invalid email format"),
     mobile: z.string().length(10, "Mobile must be 10 digit"),
     designation: z.string().min(2, "designation required"),
     role: z.string().min(2, "role required"),
     address: z.string().optional(),
     city: z.string().optional(),
     pincode: z.string().optional(),
     password: z.string().min(6, "password must be 6 char")

});

// validate readuser
const ValidateReadUser = (req, res, next) => {
     try {
          readUserSchema.parse(req.body);
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
     company_id: z.coerce.number().int("Company ID must be number"),
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
          updateUserSchema.parse(req.body)
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.message || "validation failed"
          })
     }
}

//delete user
const deleteUserSchema = z.object({
     name: z.string().min(3, "Name must be at least 3 characters"),
     company_id: z.coerce.number().int("Company ID must be number"),
     email: z.string().email("Invalid email format"),
     mobile: z.string().length(10, "Mobile number must be 10 digits"),
     designation: z.string().min(2, "Designation required"),
     role: z.string().min(2, "Role required"),
     address: z.string().optional(),
     city: z.string().optional(),
     pincode: z.string().optional(),
     password: z.string().min(6, "Password must be at least 6 characters"),
});

//validation delete user
const ValidateDeleteUser = (req, res, next) => {
     try {
          deleteUserSchema.parse(req.body);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.message,
          });
     }
};


module.exports = {
     ValidateCreateUser,
     ValidateUpdateUser,
     ValidateReadUser,
     ValidateDeleteUser,
};