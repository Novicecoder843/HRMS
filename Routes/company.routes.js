// const express = require('express');
// const router = express.Router();

// // Dummy controller
// const companyController = {
//   addCompany: (req, res) => res.send("Add Company"),
//   getCompanies: (req, res) => res.send("Get Companies")
// };

// // Routes
// router.post('/add', companyController.addCompany);
// router.get('/all', companyController.getCompanies);

// module.exports = router;


const express = require('express');
const router = express.Router();

// Dummy controller
const companyController = {
  addCompany: (req, res) => res.send("Add Company"),
  getCompanies: (req, res) => res.send("Get All Companies"),
  getCompanyById: (req, res) => res.send(`Get Company ${req.params.id}`),
  updateCompany: (req, res) => res.send(`Update Company ${req.params.id}`),
  deleteCompany: (req, res) => res.send(`Delete Company ${req.params.id}`)
};

// Routes
router.post('/add', companyController.addCompany);       // Create
router.get('/all', companyController.getCompanies);     // Read all
router.get('/:id', companyController.getCompanyById);   // Read one
router.put('/:id', companyController.updateCompany);    // Update
router.delete('/:id', companyController.deleteCompany); // Delete

module.exports = router;

