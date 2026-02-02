const express = require("express");

const router = express.Router();

const userRoutes = require("../Routes/user.routes");
const companyRoutes = require("../Routes/company.routes.js");
const departmentRoutes = require("../Routes/department.routes.js");
const roleRoutes = require("../Routes/role.routes.js");
const shiftRoutes = require("../Routes/shifts.routes.js");
const attendanceRoutes = require("./attendance.routes");
const leaveRoutes = require("./leave.routes");
const fileRoutes = require("./files.routes.js");


router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/shifts", shiftRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
router.use("/files", fileRoutes);




// Export the router below
module.exports = router;
