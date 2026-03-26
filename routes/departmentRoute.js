const express = require("express");
const router = express.Router();
const deptController = require("../controllers/departmentController");
const { protect } = require("../middleware/authMiddleware");

// ✅ CREATE DEPARTMENT
router.post("/create", protect, deptController.createDepartment);

// ✅ GET ALL DEPARTMENTS (from token company)
router.get("/", protect, deptController.getDepartments);

// ✅ GET SINGLE DEPARTMENT
router.get("/:id", protect, deptController.getDepartmentById);

// ✅ UPDATE DEPARTMENT
router.put("/:id", protect, deptController.updateDepartment);

// ✅ DELETE DEPARTMENT
router.delete("/:id", protect, deptController.deleteDepartment);

module.exports = router;