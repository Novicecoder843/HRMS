const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// 🔥 GENERATE EMP CODE (AUTO)
const generateEmpCode = async (company_id) => {
  const count = await userModel.countUsers(company_id);
  return `EMP${String(count + 1).padStart(3, "0")}`;
};



// ✅ CREATE USER
exports.createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_no,
      password,
      role_id,
      dept_id,
      designation_id,
      date_of_joining,
      date_of_exit
    } = req.body;

    // ✅ CHECK DEPARTMENT EXISTS

    if (dept_id) {
      const [dept] = await db.execute(
        "SELECT id FROM departments WHERE id = ?",
        [dept_id]
      );

      if (!dept.length) {
        return res.status(400).json({
          message: "Invalid department"
        });
      }
    }

    // ✅ CHECK DESIGNATION BELONGS TO DEPARTMENT

    if (designation_id && dept_id) {
      const [designation] = await db.execute(
        "SELECT department_id FROM designations WHERE id = ?",
        [designation_id]
      );

      if (!designation.length) {
        return res.status(400).json({
          message: "Invalid designation"
        });
      }

      if (designation[0].department_id !== dept_id) {
        return res.status(400).json({
          message: "Designation does not belong to selected department"
        });
      }
    }

    if (!first_name || !email || !password || !role_id) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    if (designation_id && !dept_id) {
      return res.status(400).json({
        message: "Department is required when designation is provided"
      });
    }
    const existing = await userModel.findByEmail(email, req.user.id);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emp_code = await generateEmpCode(req.user.id);

    await userModel.createUser({
      emp_code,
      first_name,
      last_name,
      email,
      phone_no,
      password_hash: hashedPassword,
      role_id,
      company_id: req.user.id,
      dept_id,
      designation_id,
      date_of_joining,
      date_of_exit
    });

    res.json({ message: "User created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmailGlobal(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "User inactive" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role_id: user.role_id,
        company_id: user.company_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // update last login
    await userModel.updateLastLogin(user.id);

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(
      req.params.id,
      req.user.id
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET ALL USERS (COMPANY WISE)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers(req.user.id);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "phone_no",
      "role_id",
      "dept_id",
      "designation_id",
      "status",
      "is_active",
      "date_of_joining",
      "date_of_exit"
    ];

    let updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }


    // 🔥 HANDLE VALIDATION PROPERLY

    let dept_id = updateData.dept_id;
    let designation_id = updateData.designation_id;

    // 👉 If only designation is sent, fetch existing dept
    if (designation_id && !dept_id) {
      const user = await userModel.getUserById(
        req.params.id,
        req.user.id
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      dept_id = user.dept_id;
    }

    // 👉 Validate relation
    if (designation_id && dept_id) {
      const [designation] = await db.execute(
        "SELECT department_id FROM designations WHERE id = ?",
        [designation_id]
      );

      if (!designation.length) {
        return res.status(400).json({
          message: "Invalid designation"
        });
      }

      if (designation[0].department_id !== dept_id) {
        return res.status(400).json({
          message: "Designation does not belong to selected department"
        });
      }
    }


    await userModel.updateUser(
      req.params.id,
      req.user.id,
      updateData
    );

    res.json({ message: "User updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(
      req.params.id,
      req.user.id
    );

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};