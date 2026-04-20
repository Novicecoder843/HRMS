const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const generateEmpCode = require("../utils/generateEmpCode");


// ✅ CREATE USER
exports.createUser = async (req, res) => {
  try {
    const company_id = req.user.company_id;

    const {
      first_name,
      last_name,
      email,
      password,
      phone_no,
      role_id,
      dept_id,
      designation_id,
      date_of_joining,
      date_of_exit
    } = req.body;
    

    // ✅ CHECK EMAIL
    const exists = await userModel.findByEmail(email, company_id);
    if (exists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // ✅ ROLE CHECK
    if (!(await userModel.checkRole(role_id, company_id))) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // ✅ DEPARTMENT CHECK
    if (!(await userModel.checkDepartment(dept_id, company_id))) {
      return res.status(400).json({
        message: "Invalid department"
      });
    }

    // ✅ DESIGNATION CHECK
    if (!(await userModel.checkDesignation(designation_id, dept_id, company_id))) {
      return res.status(400).json({
        message: "Invalid designation"
      });
    }

    // 🔐 HASH PASSWORD
    const password_hash = await bcrypt.hash(password, 10);

    // 🔢 GENERATE EMP CODE
    const emp_code = await generateEmpCode(company_id);

    // ✅ INSERT USER (CLEAN DATA ONLY)
    await userModel.createUser({
      emp_code,
      first_name,
      last_name,
      email,
      phone_no,
      password_hash,
      role_id,
      company_id,
      dept_id,
      designation_id,
      date_of_joining,
      date_of_exit: date_of_exit || null
    });

    res.status(201).json({
      message: "User created successfully ✅",
      emp_code
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
};


// ✅ LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company_id = req.user.company_id;

    const user = await userModel.findByEmail(email, company_id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user.id, company_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login success", token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET ALL USERS
exports.getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(req.user.company_id);
  res.json(users);
};



// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  const user = await userModel.getUserById(
    req.params.id,
    req.user.company_id
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};



// ✅ UPDATE USER
exports.updateUser = async (req, res) => {
  const company_id = req.user.company_id;
  const { id } = req.params;

  const user = await userModel.getUserById(id, company_id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await userModel.updateUser(id, req.body, company_id);

  res.json({ message: "User updated" });
};



// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  await userModel.deleteUser(req.params.id, req.user.company_id);
  res.json({ message: "User deleted" });
};