const { z } = require("zod");

/* ================= CREATE ROLE ================= */

const createRoleSchema = z.object({
     role_name: z
          .string()
          .min(3, { message: "Role name most be atleast 3 charcter" }),

     company_id: z.coerce.number({
          invalid_type_error: "Company id must be a number",
     }),
});

const ValidateCreateRole = (req, res, next) => {
     try {
          req.body = createRoleSchema.parse(req.body);
          next();
     } catch (error) {
          return res.status(400).json({
               success: false,
               errors: error.issues.map((err) => ({
                    field: err.path[0],
                    message: err.message,
               })),
          });
     }
};

/* ================= READ ROLE ================= */

const readRoleSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Role id must be a number",
     }),
});

const ValidateReadRole = (req, res, next) => {
     try {
          req.params = readRoleSchema.parse(req.params);
          next();
     } catch (error) {
          return res.status(400).json({
               success: false,
               message: error.errors?.[0]?.message || "Invalid role id",
          });
     }
};

/* ================= UPDATE ROLE ================= */



const updateRoleSchema = z
     .object({
          role_name: z
               .string()
               .min(3, "Role name atleast 3 charcter")
               .optional(),
     })
     .refine(
          (data) => Object.keys(data).length > 0,
          {
               message: "At least one field is required to update",
          }
     );

const ValidateUpdateRole = (req, res, next) => {
     try {
          req.body = updateRoleSchema.parse(req.body);
          next();
     } catch (error) {
          return res.status(400).json({
               success: false,
               message: error.errors[0].message,
          });
     }
};




/* ================= DELETE ROLE ================= */

const deleteRoleSchema = z.object({
     id: z.coerce.number({
          invalid_type_error: "Role id must be a number",
     }),
});

const ValidateDeleteRole = (req, res, next) => {
     try {
          req.params = deleteRoleSchema.parse(req.params);
          next();
     } catch (error) {
          return res.status(400).json({
               success: false,
               message: error.errors?.[0]?.message || "Invalid role id",
          });
     }
};

/* ================= EXPORTS ================= */

module.exports = {
     ValidateCreateRole,
     ValidateReadRole,
     ValidateUpdateRole,
     ValidateDeleteRole,
};
