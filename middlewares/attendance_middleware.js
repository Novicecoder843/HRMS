const { z } = require("zod");

/* ================= COMMON FIELDS ================= */

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

/* ================= CREATE ATTENDANCE ================= */

const createAttendanceSchema = z.object({
     user_id: z.coerce.number({
          invalid_type_error: "User ID must be a number",
     }),

     attendance_date: z.string()
          .regex(dateRegex, "Date must be in YYYY-MM-DD format"),

     status: z.enum(["Present", "Absent", "Leave", "Half Day"], {
          errorMap: () => ({ message: "Invalid attendance status" }),
     }).optional(),

     check_in: z.string()
          .regex(timeRegex, "Check-in must be HH:MM format")
          .optional(),

     check_out: z.string()
          .regex(timeRegex, "Check-out must be HH:MM format")
          .optional(),

     remarks: z.string().max(255).optional(),
});

const ValidateCreateAttendance = (req, res, next) => {
     try {
          req.body = createAttendanceSchema.parse(req.body);
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


/* ================= READ ATTENDANCE ================= */

const readAttendanceSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Attendance ID must be a number",
     }),
});

const ValidateReadAttendance = (req, res, next) => {
     try {
          req.params = readAttendanceSchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid attendance ID",
          });
     }
};


/* ================= UPDATE ATTENDANCE ================= */

const updateAttendanceSchema = z.object({
     user_id: z.coerce.number().optional(),

     attendance_date: z.string()
          .regex(dateRegex, "Date must be in YYYY-MM-DD format")
          .optional(),

     status: z.enum(["Present", "Absent", "Leave", "Half Day"]).optional(),

     check_in: z.string()
          .regex(timeRegex, "Check-in must be HH:MM format")
          .optional(),

     check_out: z.string()
          .regex(timeRegex, "Check-out must be HH:MM format")
          .optional(),

     remarks: z.string().max(255).optional(),

     is_deleted: z.boolean().optional(),
});

const ValidateUpdateAttendance = (req, res, next) => {
     try {
          req.body = updateAttendanceSchema.parse(req.body);
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


/* ================= DELETE ATTENDANCE ================= */

const deleteAttendanceSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Attendance ID must be a number",
     }),
});

const ValidateDeleteAttendance = (req, res, next) => {
     try {
          req.params = deleteAttendanceSchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid attendance ID",
          });
     }
};


/* ================= EXPORTS ================= */

module.exports = {
     ValidateCreateAttendance,
     ValidateReadAttendance,
     ValidateUpdateAttendance,
     ValidateDeleteAttendance,
};
