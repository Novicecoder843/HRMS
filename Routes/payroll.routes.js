const express = require("express");
const router = express.Router();
const payrollController = require("../Controller/payroll.controller");

router.post("/create", payrollController.createPayroll);
router.get("/all", payrollController.getAllPayroll);
router.get("/:id", payrollController.getPayrollById);
router.put("/update/:id", payrollController.updatePayroll);
router.delete("/:id", payrollController.deletePayroll);

module.exports = router;
