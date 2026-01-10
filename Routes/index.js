const express = require("express");

const router = express.Router();

const userRoutes = require("../Routes/user.rotes");
const companyRoutes = require("../Routes/company.rotes");


router.use("/users", userRoutes);

router.use("/designation", userRoutes);

router.use("/company", companyRoutes);
module.exports = router;