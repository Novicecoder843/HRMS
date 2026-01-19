const express = require("express");
const router = express.Router();
const departmentController = require("../Controller/department.controller");
const {
     ValidateCreateDepartment,
     ValidateReadDepartment,
     ValidateUpdateDepartment,
     ValidateDeleteDepartment
} = require("../middlewares/department_middleware")

router.post("/create",ValidateCreateDepartment, departmentController.createDepartment);

// get all departments
router.get("/all",ValidateReadDepartment,departmentController.getAllDepartment);

// get department by id

router.get("/:id", ValidateReadDepartment, departmentController.getDepartmentById);

// update department
router.put("/:id",ValidateUpdateDepartment, departmentController.updateDepartment);

// delete department
router.delete("/:id",ValidateDeleteDepartment ,departmentController.deleteDepartment);

module.exports = router;
