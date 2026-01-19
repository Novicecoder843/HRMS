const express = require("express");
const Router = express.Router();
const attendancecontroller = require("../Controller/attendance.controller");
const router = require("./department.routes");

// create attendance
router.post("/create", attendancecontroller.createAttendance);

//read attendance
router.get("/all", attendancecontroller.getAllAttendance);

//read attendance byid
router.get("/:id", attendancecontroller.getAttendanceById);

// update attendance byid
router.put("/:id", attendancecontroller.updateAttendance);

//delete Attendanceby id
router.delete("/:id", attendancecontroller.deleteAttendance); 

module.exports = router;
