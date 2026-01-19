const { z } = require("zod");

/* ================= CREATE DEPARTMENT ================= */

const createDepartmentSchema = z.object({
     name: z.string().min(3, "Department name must be at least 3 characters"),
     company_id: z.number("company Id must be a number")
     

});

const ValidateCreateDepartment = (req, res, next) => {
     try {
          req.body = createDepartmentSchema.parse(req.body);
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

/* ================= READ DEPARTMENT ================= */

const readDepartmentSchema = z.object({
     id:z.number({
          invalid_type_error: "Department id must be a number",
     }),
});

const ValidateReadDepartment = (req, res, next) => {
     try {
          req.params = readDepartmentSchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid department id",
          });
     }
};

/* ================= UPDATE DEPARTMENT ================= */

const updateDepartmentSchema = z.object({
     name: z.string().min(3).optional(),
     company_id: z.number().optional(),
});

const ValidateUpdateDepartment = (req, res, next) => {
     try {
          req.body = updateDepartmentSchema.parse(req.body);
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

/* ================= DELETE DEPARTMENT ================= */

const deleteDepartmentSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Department id must be a number",
     }),
});

const ValidateDeleteDepartment = (req, res, next) => {
     try {
          req.params = deleteDepartmentSchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid department id",
          });
     }
};

/* ================= EXPORTS ================= */

module.exports = {
     ValidateCreateDepartment,
     ValidateReadDepartment,
     ValidateUpdateDepartment,
     ValidateDeleteDepartment,
};
