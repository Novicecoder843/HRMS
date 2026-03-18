const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const companyModel = require("../models/companyModel");

// Register Company
exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password, address, city } = req.body;

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

    // 1️⃣ Create company
    const result = await companyModel.createCompany({
      name,
      email,
      password: hashedPassword,
      address,
      city
    });

    const companyId = result.insertId;

    //  2️⃣ CREATE ADMIN USER (IMPORTANT)
    await db.query(
      "INSERT INTO users (company_id, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
      [companyId, email, hashedPassword, 1] // role_id = 1 (ADMIN)
    );

    // 3️⃣ INSERT PERMISSION
   await db.query(
    `INSERT INTO role_permissions (role_id, permission_name) VALUES
    (1, 'CREATE_USER'),
    (1, 'VIEW_USERS'),
    (1, 'VIEW_EMPLOYEES'),
    (1, 'VIEW_ASSIGNED_EMPLOYEES'),
    (1, 'UPDATE_PROFILE')
  `);

    res.status(201).json({
      message: "Company + Admin created successfully",
      companyId
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// Login Company
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
