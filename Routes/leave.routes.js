const express = require("express");
const router = express.Router();
const leaveController = require("../Controller/leave.controller");

const {
     validateApplyLeave,
     validateAssignBalance,
     validateLeaveType
} = require("../middlewares/leave_middleware");

// add leave
router.post("/add-type", validateLeaveType, leaveController.addLeaveType);

//Assign balance to employee
router.post("/assignbalance", validateAssignBalance, leaveController.assignLeaveBalance);

//apply leave request
router.post('/apply-leave', validateApplyLeave, leaveController.applyLeave);

//update leave
router.patch('/update-status', leaveController.updateLeaveStatus);

module.exports = router; 