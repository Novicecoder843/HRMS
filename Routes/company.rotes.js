const express = require('express');
const router = express.Router();

const companyController = require("../Controller/company.controller");

//Creat Company
router.post('/create', companyController.createCompany);


//Read Company
router.get('/all', companyController.getAllCompany);

//Read by id path params, query params
router.get('/getcompany/:id', companyController.getCompanyById)

//Update Company by id
router.put('/updatecompany/:id', companyController.UpdateCompany)

//Delete Company
// router.delete('/delete/:id', companyController.deleteCompany) 


router.delete('/delete/:id', companyController.softDeleteCompany)
// router.delete('/delete/:id', companyController.hardDeleteCompany) 



module.exports = router;

