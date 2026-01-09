const express = require("express");

const router = express.Router();

const userRoutes = require("../Routes/user.routes");
const companyRoutes=require("../Routes/company.routes.js")
const departmentRoutes = require("../Routes/department.routes.js");
const roleRoutes = require("../Routes/role.routes.js");
const shiftRoutes=require("../Routes/shifts.routes.js")

router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
router.use("/departments", departmentRoutes);
router.use("/roles",roleRoutes);
router.use("/shifts",shiftRoutes);

module.exports = router;
