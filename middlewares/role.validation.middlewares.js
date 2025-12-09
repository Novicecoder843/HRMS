const { z } = require("zod");

// ID Validation for URL parameters
const idSchema = z.object({
    id: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num > 0;
    }, {
        message: "ID must be a positive integer in string format.",
    }),
});

// 1. Middleware for Create Role
exports.validateCreateRole = (req, res, next) => {
    try {
        const roleSchema = z.object({
            role_name: z.string().min(2, "Role name must be at least 2 characters long."),
            company_id: z.coerce.number().int().positive("Company ID must be a positive integer.").optional().nullable(),
        });
        roleSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.errors ? err.errors[0].message : err.message,
        });
    }
};

// 2. Middleware for Update Role (only role_name)
exports.validateUpdateRole = (req, res, next) => {
    try {
        const updateSchema = z.object({
            role_name: z.string().min(2, "Role name must be at least 2 characters long."),
        });
        
        updateSchema.parse(req.body);
        
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update. Only 'role_name' can be updated.",
            });
        }
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.errors ? err.errors[0].message : err.message,
        });
    }
};

// 3. Middleware for ID validation
exports.validateRoleId = (req, res, next) => {
    try {
        idSchema.parse(req.params);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Role ID format in parameters.",
        });
    }
};