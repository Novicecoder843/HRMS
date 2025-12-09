const express = require("express");
const router = express.Router();

const departmentController = require("../Controller/department.controller");
const {
  validateCreateDepartment,
  validateUpdateDepartment,
  validateDepartmentId,
} = require("../middlewares/department.validation.middlewares");

// Create Department
router.post("/add", validateCreateDepartment, departmentController.createDepartment);

// Get All Departments (Pagination)
router.get("/getall", departmentController.getAllDepartments);

// Get Department by ID
router.get("/getdepartment/:id", validateDepartmentId, departmentController.getDepartmentById);

// Update Department
router.put("/update/:id", validateDepartmentId, validateUpdateDepartment, departmentController.updateDepartment);

// Soft Delete Department
router.delete("/delete/:id", validateDepartmentId, departmentController.deleteDepartment);

module.exports = router;
