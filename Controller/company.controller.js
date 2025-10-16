const Company = require("../models/company.model");

// Create company
exports.createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

// Get all companies
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

// Get single company
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
};

// Update company
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    await company.update(req.body);
    res.json(company);
  } catch (err) {
    next(err);
  }
};

// Delete company
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    await company.destroy();
    res.json({ message: "Company deleted" });
  } catch (err) {
    next(err);
  }
};
