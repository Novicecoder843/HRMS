const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const { verifyToken, verifyUser } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");

// ✅ CHECK-IN
router.post("/check-in",verifyToken,verifyUser,attendanceController.checkIn);

// ✅ CHECK-OUT
router.post("/check-out",verifyToken,verifyUser,attendanceController.checkOut);

// 📄 MY ATTENDANCE
router.get("/my",verifyToken,verifyUser,attendanceController.getMyAttendance);

// 👥 ALL ATTENDANCE (HR / Admin / Manager / TL)
router.get("/all",verifyToken,verifyUser,checkPermission("VIEW_ATTENDANCE"),attendanceController.getAllAttendance);

module.exports = router;