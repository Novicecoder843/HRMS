const express = require("express");
const router = express.Router();

const roleController = require("../controllers/roleController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const {createRoleSchema,updateRoleSchema} = require("../validations/roleValidation");

// CREATE
router.post("/create",verifyToken,validate(createRoleSchema),roleController.createRole);

// GET ALL
router.get("/",verifyToken,roleController.getRoles);

// GET BY ID
router.get("/:id",verifyToken,roleController.getRoleById);

// UPDATE
router.put("/:id",verifyToken,validate(updateRoleSchema),roleController.updateRole);

// DELETE
router.delete("/:id",verifyToken,roleController.deleteRole);

module.exports = router;