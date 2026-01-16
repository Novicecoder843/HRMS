const {z}=require("zod");

const leaveTypeSchema= z.object({
    company_id:z.coerce.number().int().positive("Company id should be valid"),
    name:z.string().min(2,"Leave type name must be at least 2 characters"),
    total_days:z.number().min(1,"Leave must be allowed for at least 1 day")

});

const assignBalanceSchema = z.object({
    user_id:z.coerce.number().int().positive(),
    leave_type_id:z.coerce.number().int().positive(),
    remaining_days:z.number().min(0),
    year:z.number().int().min(2024)
});


const applyLeaveSchema=z.object({
    
    user_id: z.coerce.number().int().positive(),
    leave_type_id: z.coerce.number().int().positive(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
    total_days: z.number().positive(),
    reason: z.string().optional()

});

// Middleware Functions

exports.validateLeaveType = (req, res, next) => {
    try {
        leaveTypeSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ success: false, message: err.errors[0].message });
    }
};

exports.validateAssignBalance = (req, res, next) => {
    try {
        assignBalanceSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ success: false, message: err.errors[0].message });
    }
};


exports.validateApplyLeave = (req, res, next) => {
    try {
        applyLeaveSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ success: false, message: err.errors[0].message });
    }
};