const { z } = require("zod");

//Create middleware validation
const createCompanySchema = z.object({
  name: z
    .string({
      required_error: "Company name is required",
    })
    .min(3, "Name must be at least 3 characters long"),
  email: z
    .string({
      required_error: "Company email is required",
    })
    .email("Invalid email format"),
  mobile: z
    .string({
      required_error: "Mobile number is required",
    })
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .optional(),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(2, "City name must be at least 2 characters long"),
  pincode: z
    .string({
      required_error: "Pincode is required",
    })
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

const validateCreateCompany = (req, res, next) => {
    try {
        createCompanySchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
        });
    }
};

//Get id validation
const idSchema = z.object({
    id: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num > 0;
    }, {
        message: "ID must be a positive integer in string format",
    }),
});
const validateCompanyId = (req, res, next) => {
    try {
        idSchema.parse(req.params);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Company ID format",
        });
    }
};


//Update validation
const updateCompanySchema = createCompanySchema.partial();
const idSchemaa = z.object({
    id: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num > 0;
    }, {
        message: "ID must be a positive integer in string format",
    }),
});
const validateUpdateCompany = (req, res, next) => {
    try {
        updateCompanySchema.parse(req.body); 

        if (Object.keys(req.body).length === 0) {
             return res.status(400).json({
                success: false,
                message: "No fields provided for update. Please send at least one field.",
            });
        }
        
        next();
    } catch (err) {
         return res.status(400).json({
            success: false,
            message: "Validation failed during update",
        });
    }
};

module.exports = {
    validateCreateCompany,
    validateCompanyId,
    validateUpdateCompany

}

