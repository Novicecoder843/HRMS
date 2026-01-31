const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const companyRoutes = require("./company.routes");
const designationRoutes = require("./designation.routes");
const departmentRoutes = require("../Routes/department.routes");
const RoleRoutes = require("../Routes/role.routes");
const attendanceRoutes = require("../Routes/attendance.routes");

router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
router.use("/designations", designationRoutes);
router.use("/department", departmentRoutes);
router.use("/Role", RoleRoutes);
router.use("/attendance", attendanceRoutes);

module.exports = router;
