const Company = require("../models/company.model");

// CREATE
exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ message: "Company created", company });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.getAll();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET BY ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.getById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.update(req.params.id, req.body);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company updated", company });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.delete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted", company });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
