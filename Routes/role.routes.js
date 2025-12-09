const express = require('express');
const router = express.Router();

const roleController = require("../Controller/role.controller");
const {
    validateCreateRole,
    validateUpdateRole,
    validateRoleId,
} = require("../middlewares/role.validation.middlewares");

//Create Role
router.post("/add",  validateCreateRole, roleController.createRole);

//Get All
router.get("/getall",  roleController.getAllRoles);

//Get Role by ID
router.get("/getrole/:id",  validateRoleId, roleController.getRoleById);

//Update Role
router.put("/update/:id", validateRoleId, validateUpdateRole, roleController.updateRole);

//Delete Role
router.delete("/delete/:id", validateRoleId, roleController.deleteRole);

module.exports = router;

