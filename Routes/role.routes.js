const express = require("express");
const router = express.Router();
const roleController = require("../Controller/role.controller");


const {
     ValidateCreateRole,
     ValidateReadRole,
     ValidateUpdateRole,
     ValidateDeleteRole,
} = require("../middlewares/role_middleware");

// CREATE ROLE 
router.post( "/create", ValidateCreateRole,roleController.createRole);

// GET ALL ROLES (PROTECTED)
router.get(
     "/all",
     roleController.getAllRoles
);

// GET ROLE BY ID (PROTECTED)
router.get(
     "/:id",
     ValidateReadRole,
     roleController.getRoleById
);

// UPDATE ROLE (PROTECTED)
router.put(
     "/:id",
     ValidateUpdateRole,
     roleController.updateRole
);

// DELETE ROLE (PROTECTED)
router.delete(
     "/:id",
     ValidateDeleteRole,
     roleController.deleteRole
);

module.exports = router;

