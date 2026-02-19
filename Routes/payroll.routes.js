const express = require("express");
const router = express.Router();

const payrollController = require("../Controller/payroll.controller");

// CRUD
router.post("/create", payrollController.createPayroll);
router.get("/all", payrollController.getAllPayroll);
router.get("/:id", payrollController.getPayrollById);
router.put("/update/:id", payrollController.updatePayroll);
router.delete("/:id", payrollController.deletePayroll);

// Salary Slip
router.get("/salary-slip/:id", payrollController.generateSalarySlip);

module.exports = router;
