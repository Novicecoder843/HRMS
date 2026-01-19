const { z } = require("zod");

/* ================= CREATE DESIGNATION ================= */

const createDesignationSchema = z.object({
     name: z.string().min(2, "Designation name must be at least 2 characters"),
     department_id: z.coerce.number({
          required_error: "department_id is required",
          invalid_type_error: "department_id must be a number",
     }),
});

const ValidateCreateDesignation = (req, res, next) => {
     try {
          req.body = createDesignationSchema.parse(req.body);
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

/* ================= READ DESIGNATION ================= */

const readDesignationSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Designation id must be a number",
     }),
});

const ValidateReadDesignation = (req, res, next) => {
     try {
          req.params = readDesignationSchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid designation id",
          });
     }
};

/* ================= UPDATE DESIGNATION ================= */

const updateDesignationSchema = z.object({
     name: z.string().min(2).optional(),
     department_id: z.coerce.number().optional(),
});

const ValidateUpdateDesignation = (req, res, next) => {
     try {
          req.body = updateDesignationSchema.parse(req.body);
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

/* ================= DELETE DESIGNATION ================= */

const deleteDesignationSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Designation id must be a number",
     }),
});

const ValidateDeleteDesignation = (req, res, next) => {
     try {
          req.params = deleteDesignationSchema.parse(req.params);
          next();
     } catch (err) {
          return res.status(400).json({
               success: false,
               message: err.issues?.[0]?.message || "Invalid designation id",
          });
     }
};

/* ================= EXPORTS ================= */

module.exports = {
     ValidateCreateDesignation,
     ValidateReadDesignation,
     ValidateUpdateDesignation,
     ValidateDeleteDesignation,
};
