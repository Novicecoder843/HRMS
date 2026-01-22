const roleService = require("../Service/role.service");

// CREATE role
exports.createRole = async (req, res) => {
     try {
          const role = await roleService.createRole({
               role_name: req.body.role_name,
               company_id: req.body.company_id,
          });

          res.status(200).json({
               success: true,
               message: "Role created successfully",
               data: role,
          });
     } catch (err) {
          res.status(400).json({
               success: false,
               message: err.message,
          });
     }
};

// READ all
// READ all roles
exports.getAllRoles = async (req, res) => {
     try {
          const roles = await roleService.findAll(req.user.company_id);

          res.status(200).json({
               success: true,
               data: roles,
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: err.message,
          });
     }
};


// READ by ID
exports.getRoleById = async (req, res) => {
     const role = await roleService.getRoleById(
          req.params.id,
          req.user.company_id
     );

     if (!role) {
          return res.status(404).json({
               success: false,
               message: "Role not found",
          });
     }

     res.json({
          success: true,
          data: role
     });
};



// UPDATE
exports.updateRole = async (req, res) => {
     try {
          // 1️⃣ role_name validation
          if (!req.body.role_name) {
               return res.status(400).json({
                    success: false,
                    message: "role_name is required",
               });
          }

          // 2️⃣ company_id token 
          if (!req.user || !req.user.company_id) {
               return res.status(401).json({
                    success: false,
                    message: "Company ID missing from token",
               });
          }

          // 3️⃣ Update role
          const role = await roleService.updateRole(
               req.params.id,
               req.body,
               req.user.company_id
          );
          

          if (!role) {
               return res.status(404).json({
                    success: false,
                    message: "Role not found",
               });
          }

          res.status(200).json({
               success: true,
               message: "Role updated successfully",
               data: role,
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: err.message,
          });
     }
};

// DELETE
exports.deleteRole = async (req, res) => {
     const role = await roleService.deleteRole(
          req.params.id,
          req.user.company_id
     );

     if (!role) {
          return res.status(404).json({
               success: false,
               message: "Role not found",
          });
     }

     res.json({
          success: true,
          message: "Role deleted successfully",
     });
};