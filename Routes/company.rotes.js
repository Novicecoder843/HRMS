const express = require('express');
const router = express.Router();
const { authenticate } = require("../middlewares/auth_middleware");

const companyController = require("../Controller/company.controller");

const {
     ValidateCreateCompany,
     ValidateReadCompany,
     ValidateUpdateCompany, 
     ValidateDeleteCompany
} = require("../middlewares/company_middleware");




//

//create company
router.post(
     "/create",
     authenticate,
     ValidateCreateCompany,
     companyController.createCompany
);


// Get all companies
router.get(
     "/all",
     authenticate,
     companyController.getAllCompany
);

// read companyby id
router.get("/:id", authenticate, ValidateReadCompany, companyController.getCompanyById);

//update company
router.put(
     "/:id",
     authenticate,
     ValidateUpdateCompany,
     companyController.UpdateCompany
);

//delete company
router.delete("/:id", authenticate, ValidateDeleteCompany, companyController.deleteCompany);


 

// soft delete
router.delete('/delete/:id', companyController.softDeleteCompany) 
// router.delete('/delete/:id', companyController.hardDeleteCompany) 



module.exports = router;


