const { z } = require("zod");

/**
 * Helper to handle Zod errors and format them consistently 
 * with your other middlewares (like company/user middleware).
 */
const validate = (schema) => (req, res, next) => {
     try {
          schema.parse(req.body);
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

// 1. Schema for adding a Leave Type (e.g., Casual Leave, Sick Leave)
const leaveTypeSchema = z.object({
     company_id: z.coerce.number({ required_error: "Company ID is required" }),
     name: z.string().min(2, "Leave type name is too short (e.g.,UL, SL, PL)"),
     days_per_year: z.number().min(1, "Days per year must be at least 1"),
     is_carry_forward: z.boolean().optional().default(false)
});

// 2. Schema for assigning balance to an employee
const assignBalanceSchema = z.object({
     user_id: z.coerce.number({ required_error: "User ID is required" }),
     leave_type_id: z.number({ required_error: "Leave Type ID is required" }),
     total_balance: z.number().min(0, "Balance cannot be negative"),
     year: z.number().int().min(2024, "Invalid year")
});

// 3. Schema for applying for leave
const applyLeaveSchema = z.object({
     leave_type_id: z.number({ required_error: "Please select a leave type" }),
     from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
     to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
     half_day_type: z.enum(['none', 'first_half', 'second_half']).default('none'),
     reason: z.string().min(5, "Please provide a valid reason (min 5 chars)"),
     assigned_to: z.number({ required_error: "Approver/Manager ID is required" })
}).refine((data) => {
     // Logic: to_date cannot be before from_date
     return new Date(data.to_date) >= new Date(data.from_date);
}, {
     message: "To Date cannot be earlier than From Date",
     path: ["to_date"]
});

// Exporting the middleware functions
module.exports = {
     validateLeaveType: validate(leaveTypeSchema),
     validateAssignBalance: validate(assignBalanceSchema),
     validateApplyLeave: validate(applyLeaveSchema)
};