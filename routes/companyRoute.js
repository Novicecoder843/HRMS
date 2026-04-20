const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");
const { validate } = require("../middleware/validateMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");

const {registerCompanySchema,loginCompanySchema} = require("../validations/companyValidation");


// REGISTER
router.post("/register",validate(registerCompanySchema),companyController.registerCompany);

// LOGIN
router.post("/login",validate(loginCompanySchema),companyController.loginCompany);

// PROFILE
router.get("/profile", verifyToken, companyController.getCompanyProfile);

// UPDATE
router.put("/update", verifyToken, companyController.updateCompany);

module.exports = router;