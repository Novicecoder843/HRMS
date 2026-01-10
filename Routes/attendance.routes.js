const express = require("express");
const router = express.Router();
const attendanceController = require("../Controller/attendance.controller");
const { authenticate } = require("../middlewares/auth.middlewares");

router.post("/punch-in", authenticate, attendanceController.punchIn);
router.post("/punch-out", authenticate, attendanceController.punchOut);

module.exports = router;
