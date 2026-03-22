const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const companyModel = require("../models/companyModel");

// Register Company
exports.registerCompany = async (req, res) => {

  try {
    const { name, email, password, ALIAS , pincode , address, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password required"
      });
    }

    const existingCompany = await companyModel.findByEmail(email);

    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await companyModel.registerCompany({
      name,
      email,
      password: hashedPassword,
      ALIAS,
      pincode,
      address,
      city
    });

    res.status(201).json({
      message: "Company created successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await companyModel.findByEmail(email);

    if (!company) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: company.id,
        email: company.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Company Profile
exports.getCompanyProfile = async (req, res) => {
  try {

    const company = await companyModel.getCompanyById(req.user.id);

    res.json({
      company
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};

// Update Company Profile

exports.updateCompany = async (req, res) => {
  try {
    const companyId = req.user.id;
    const existingCompany = await companyModel.getCompanyById(companyId);

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    // take only allowed fields
    const { name, ALIAS, pincode, address, city } = req.body;

    // prepare update data (only if provided)
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (ALIAS !== undefined) updateData.ALIAS = ALIAS;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;

    // check if nothing to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided to update"
      });
    }

    await companyModel.updateCompany(companyId, updateData);

    res.json({
      message: "Company updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
