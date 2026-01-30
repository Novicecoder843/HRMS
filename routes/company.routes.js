const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");

// CRUD routes
router.post("/", companyController.createCompany);       // Create
router.get("/", companyController.getAllCompanies);     // Read all
router.get("/:id", companyController.getCompanyById);   // Read one
router.put("/:id", companyController.updateCompany);    // Update
router.delete("/:id", companyController.deleteCompany); // Delete (soft)


module.exports = router;


