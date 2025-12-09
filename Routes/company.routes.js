const express = require('express');
const router=express.Router();

const companyController = require("../Controller/company.controller")
const {validateCreateCompany,
    validateCompanyId,
    validateUpdateCompany

}=require("../middlewares/company.validation.middlewares")

//Create Company
router.post("/add",validateCreateCompany,companyController.createCompany)

// Get all companies
router.get("/getall", companyController.getAllCompanies);

//Get companies by id
router.get("/getcompany/:id",validateCompanyId,companyController.getCompanyById);

//Update Company
router.put("/updatecompany/:id",validateCompanyId,validateUpdateCompany,companyController.updateCompany)

//softDelete
router.delete("/softdelete/:id",validateCompanyId, companyController.softDeleteCompany);

module.exports = router;