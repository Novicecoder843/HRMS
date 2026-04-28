const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const generateEmpCode = require("../utils/generateEmpCode");


// =======================================================
// 🏢 CREATE ADMIN (MANUAL ROLE_ID)
// =======================================================
exports.createAdmin = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { first_name, last_name, email, password, phone_no, role_id } = req.body;

    // 🔥 VALIDATE ROLE
    const role = await userModel.getRoleByIdAndCompany(role_id, company_id);

    if (!role) {
      return res.status(400).json({
        message: "Invalid role for this company ❌"
      });
    }

    // 🔥 ONLY ADMIN ROLE ALLOWED
    if (role.role_name !== "Admin") {
      return res.status(400).json({
        message: "Only Admin role allowed ❌"
      });
    }

    // ❌ prevent duplicate admin
    const existing = await userModel.findAdminByCompany(company_id, role_id);
    if (existing) {
      return res.status(400).json({
        message: "Admin already exists ❌"
      });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const emp_code = await generateEmpCode(company_id);

    await userModel.createUser({
      emp_code,
      first_name,
      last_name,
      email,
      phone_no,
      password_hash,
      role_id,
      company_id,
      dept_id: null,
      designation_id: null,
      date_of_joining: new Date(),
      date_of_exit: null
    });

    res.status(201).json({
      message: "Admin created successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// =======================================================
// 🔐 LOGIN USER
// =======================================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmailGlobal(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials ❌"
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials ❌"
      });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        company_id: user.company_id,
        role_id: user.role_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token,user: {
        user_id: user.id,
        first_name: user.first_name,
        email: user.email,
        role_id: user.role_id,
        company_id: user.company_id
      }
 });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { company_id, role_id: creatorRoleId } = req.user;

    const {
      first_name,
      last_name,
      email,
      password,
      phone_no,
      role_id,
      dept_id,
      designation_id,
      date_of_joining
    } = req.body;

    // =======================================================
    // 🔥 1. VALIDATE ROLE (VERY IMPORTANT)
    // =======================================================
    const targetRole = await userModel.getRoleByIdAndCompany(role_id, company_id);

    if (!targetRole) {
      return res.status(400).json({
        message: "Invalid role for this company ❌"
      });
    }

    // =======================================================
    // 🔥 2. VALIDATE DEPARTMENT
    // =======================================================
    if (dept_id) {
      const dept = await userModel.getDepartmentById(dept_id);

      if (!dept || dept.company_id !== company_id) {
        return res.status(400).json({
          message: "Invalid department ❌"
        });
      }
    }

    // =======================================================
    // 🔥 3. VALIDATE DESIGNATION (YOUR MAIN BUG FIX)
    // =======================================================
    if (designation_id) {
      const designation = await userModel.getDesignationById(designation_id);

      if (!designation) {
        return res.status(400).json({
          message: "Invalid designation ❌"
        });
      }

      if (designation.company_id !== company_id) {
        return res.status(400).json({
          message: "Designation does not belong to your company ❌"
        });
      }

      if (dept_id && designation.dept_id !== dept_id) {
        return res.status(400).json({
          message: "Designation does not belong to selected department ❌"
        });
      }
    }

    // =======================================================
    // 🔥 4. RBAC CHECK
    // =======================================================
    const creatorRole = await userModel.getRoleById(creatorRoleId);

    if (
      creatorRole?.role_name === "HR" &&
      targetRole?.role_name === "Admin"
    ) {
      return res.status(403).json({
        message: "HR cannot create Admin ❌"
      });
    }

    // =======================================================
    // 🔥 5. DUPLICATE EMAIL
    // =======================================================
    const exists = await userModel.findByEmail(email, company_id);

    if (exists) {
      return res.status(400).json({
        message: "Email already exists ❌"
      });
    }

    // =======================================================
    // 🔥 6. CREATE USER
    // =======================================================
    const password_hash = await bcrypt.hash(password, 10);
    const emp_code = await generateEmpCode(company_id);

    await userModel.createUser({
      emp_code,
      first_name,
      last_name,
      email,
      phone_no,
      password_hash,
      role_id,
      company_id,
      dept_id: dept_id || null,
      designation_id: designation_id || null,
      date_of_joining,
      date_of_exit: null
    });

    res.status(201).json({
      message: "User created successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =======================================================
// 📄 GET USERS
// =======================================================
exports.getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(req.user.company_id);
  res.json(users);
};


// =======================================================
// 🔍 GET USER BY ID
// =======================================================
exports.getUserById = async (req, res) => {
  const user = await userModel.getUserById(
    req.params.id,
    req.user.company_id
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found ❌"
    });
  }

  res.json(user);
};


// =======================================================
// ✏️ UPDATE USER
// =======================================================
exports.updateUser = async (req, res) => {
  await userModel.updateUser(
    req.params.id,
    req.body,
    req.user.company_id
  );

  res.json({
    message: "User updated ✅"
  });
};


// =======================================================
// ❌ DELETE USER
// =======================================================
exports.deleteUser = async (req, res) => {
  await userModel.softDeleteUser(
    req.params.id,
    req.user.company_id
  );

  res.json({
    message: "User deleted ✅"
  });
};