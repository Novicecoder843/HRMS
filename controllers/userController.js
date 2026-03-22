const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Create user
exports.createUser = async (req, res) => {
  try {
    const data = req.body;

    const existing = await userModel.getUserByEmail(data.email);

    if (existing) {
      return res.status(400).json({ message: "Email exists" });
    }

    // 🔐 hash password
    data.password_hash = await bcrypt.hash(data.password, 10);

    delete data.password; // ✅ IMPORTANT

    await userModel.createUser(data);

    res.json({ message: "User created" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,        
        company_id: user.company_id   
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get users
exports.getUsers = async (req, res) => {
 const users = await userModel.getUsers(req.user.company_id);
 res.json(users);
};

