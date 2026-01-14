const express = require("express");
const router = express.Router();
const leaveController = require("../Controller/leave.controller");

// add leave
router.post("/add-type", leaveController.addLeaveType);

//Assign balance to employee
router.post("/assign-balance", leaveController.assignLeaveBalance);

//apply leave request
router.post('/apply-leave', leaveController.applyLeave);

//update leave
router.patch('/update-status', leaveController.updateLeaveStatus);

module.exports = router;