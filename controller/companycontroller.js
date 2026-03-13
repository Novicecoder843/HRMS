const company = require("../models/companyModel");

exports.create = async (req, res) => {

  try {

    const result = await company.createCompany(req.body);

    res.json({
      message: "Company created",
      id: result.insertId
    });

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.getAll = async (req, res) => {

  try {

    const companies = await company.getAllCompanies();

    res.json(companies);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.getById = async (req, res) => {

  try {

    const data = await company.getCompanyById(req.params.id);

    res.json(data);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.update = async (req, res) => {

  try {

    await company.updateCompany(req.params.id, req.body);

    res.json({
      message: "Company updated"
    });

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.delete = async (req, res) => {

  try {

    await company.deleteCompany(req.params.id);

    res.json({
      message: "Company deleted"
    });

  } catch (error) {

    res.status(500).json(error);

  }

};