const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const companyModel = require("../models/companyModel");

// 🟢 REGISTER COMPANY
exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password, ALIAS, pincode, address, city } = req.body;

    // check existing
    const existing = await companyModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        message: "Company already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await companyModel.createCompany({
      name,
      email,
      password: hashedPassword,
      ALIAS,
      pincode,
      address,
      city
    });

    res.status(201).json({
      message: "Company registered successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔵 LOGIN COMPANY
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await companyModel.findByEmail(email);

    if (!company) {
      return res.status(400).json({
        message: "Company not found"
      });
    }

    const match = await bcrypt.compare(password, company.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // 🔐 TOKEN
    const token = jwt.sign(
      {
        company_id: company.id,
        email: company.email,
        name: company.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
''
   res.json({
      message: "Login successful ✅",
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🟡 GET COMPANY PROFILE
exports.getCompanyProfile = async (req, res) => {
  try {
    const company_id = req.user.company_id;

    const company = await companyModel.findById(company_id);

    res.json(company);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟠 UPDATE COMPANY


exports.updateCompany = async (req, res) => {
  try {
    const company_id = req.user.company_id;

    const existing = await companyModel.findById(company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    // ✅ KEEP OLD VALUE IF NOT PROVIDED
    const updatedData = {
      name: req.body.name ?? existing.name,
      ALIAS: req.body.ALIAS ?? existing.ALIAS,
      pincode: req.body.pincode ?? existing.pincode,
      address: req.body.address ?? existing.address,
      city: req.body.city ?? existing.city
    };

    await companyModel.updateCompany(company_id, updatedData);

    res.json({
      message: "Company updated successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
