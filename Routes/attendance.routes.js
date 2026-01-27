const express = require("express");
const Router = express.Router();
const attendancecontroller = require("../Controller/attendance.controller");

const {
     ValidateCreateAttendance,
     ValidateReadAttendance,
     ValidateUpdateAttendance,
     ValidateDeleteAttendance
} = require("../middlewares/attendance_middleware");
const router = require("./role.routes");

router.post("/create", ValidateCreateAttendance,attendancecontroller.createAttendance);

// get all Attendance
router.get("/all",ValidateReadAttendance,attendancecontroller.getAllAttendance);

// get department by id

router.get("/:id", ValidateReadAttendance, attendancecontroller.getAttendanceById);

// update department
router.put("/:id", ValidateUpdateAttendance,attendancecontroller.updateAttendance);

// delete department
router.delete("/:id", ValidateDeleteAttendance,attendancecontroller.deleteAttendance);

module.exports = router;

