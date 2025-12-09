const express = require("express");

const router = express.Router();

const userRoutes = require("../Routes/user.routes");
const companyRoutes=require("../Routes/company.routes.js")

router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
module.exports = router;
