const express = require("express");
const router = express.Router();
const departmentController = require("../Controller/department.controller");

router.post("/create", departmentController.createDepartment);

// get all departments
router.get("/all",  departmentController.getAllDepartment);

// get department by id
router.get("/:id",  departmentController.getDepartmentById);

// update department
router.put("/:id", departmentController.updateDepartment);

// delete department
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
