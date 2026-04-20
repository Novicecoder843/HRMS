const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const {createDepartmentSchema,updateDepartmentSchema} = require("../validations/departmentValidation");

// CREATE
router.post("/create",verifyToken,validate(createDepartmentSchema),departmentController.createDepartment);

// GET ALL
router.get("/",verifyToken,departmentController.getDepartments);

// GET BY ID
router.get("/:id",verifyToken,departmentController.getDepartmentById);

// UPDATE
router.put("/:id",verifyToken,validate(updateDepartmentSchema),departmentController.updateDepartment);

// DELETE
router.delete("/:id",verifyToken,departmentController.deleteDepartment);

module.exports = router;