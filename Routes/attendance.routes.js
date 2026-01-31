const express = require("express");
const router = express.Router();
const attendanceController = require("../Controller/attendance.controller");
const { authenticate } = require("../middlewares/auth_middleware");

// Punching API
router.post("/punch", authenticate, attendanceController.punchAction);

// Get My Attendance Report
router.get("/my-report", authenticate, attendanceController.myReport);

module.exports = router;