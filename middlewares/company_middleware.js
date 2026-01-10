// create company

const { z, success } = require('zod'); 

/* ================= CREATE COMPANY ================= */

const createCompanySchema = z.object({
     name: z.string().min(3, "Company name must be at least 3 characters", "Company name must contain letters"),
     address: z.string().min(5, "Address must be at least 5 characters"),
     city: z.string().min(2, "City is required"),
     state: z.string().min(2, "State is required"),
     country: z.string().min(2, "Country is required"),
     email: z.string().email("Invalid company email"),
     pincode: z.string().optional(),
});

const ValidateCreateCompany = (req, res, next) => {
     try {
          createCompanySchema.parse(req.body);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               errors: err.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
               })),
          });
     }
};

/* ================= READ COMPANY (BY ID) ================= */

const ReadCompanySchema = z.object({
     name: z.string().min(3, "Company name must be at least 3 characters", "Company name must contain letters"),
     address: z.string().min(5, "Address must be at least 5 characters"),
     city: z.string().min(2, "City is required"),
     state: z.string().min(2, "State is required"),
     country: z.string().min(2, "Country is required"),
     email: z.string().email("Invalid company email"),
     pincode: z.string().optional(),
});



const ValidateReadCompany = (req, res, next) => {
     try {
          readCompanySchema.parse(req.body);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid company id",
          });
     }
};

/* ================= UPDATE COMPANY ================= */

const UpdateCompanySchema = z.object({
     name: z.string().min(3, "Company name must be at least 3 characters", "Company name must contain letters"),
     address: z.string().min(5, "Address must be at least 5 characters"),
     city: z.string().min(2, "City is required"),
     state: z.string().min(2, "State is required"),
     country: z.string().min(2, "Country is required"),
     email: z.string().email("Invalid company email"),
     pincode: z.string().optional(),
});



const ValidateUpdateCompany = (req, res, next) => {
     try {
          UpdateCompanySchema.parse(req.body);
          next();
     } catch (err) {
          if (err instanceof z.ZodError) {
               return res.status(400).json({
                    success: false,
                    errors: err.issues.map(issue => ({
                         field: issue.path[0],
                         message: issue.message,
                    })),
               });
          }

          // non-zod error fallback
          return res.status(500).json({
               success: false,
               message: "Internal validation error",
          });
     }
};


/* ================= DELETE COMPANY ================= */


const deleteCompanySchema = z.object({
     name: z.string().min(3, "Company name must be at least 3 characters", "Company name must contain letters"),
     address: z.string().min(5, "Address must be at least 5 characters"),
     city: z.string().min(2, "City is required"),
     state: z.string().min(2, "State is required"),
     country: z.string().min(2, "Country is required"),
     email: z.string().email("Invalid company email"),
     pincode: z.string().optional(),
});

const ValidateDeleteCompany = (req, res, next) => {
     try {
          deleteCompanySchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid company id",
          });
     }
};

/* ================= EXPORTS ================= */

module.exports = {
     ValidateCreateCompany,
     ValidateReadCompany,
     ValidateUpdateCompany,
     ValidateDeleteCompany,
};
