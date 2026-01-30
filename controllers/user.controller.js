const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const {
      emp_code, first_name, last_name, email, phone,
      company_id, dept_id, designation_id, role_id,
      password, date_of_joining
    } = req.body;

    if (!emp_code || !first_name || !email || !password || !company_id || !role_id) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      emp_code,
      first_name,
      last_name,
      email,
      phone,
      company_id,
      dept_id,
      designation_id,
      role_id,
      password_hash,
      date_of_joining
    });

    res.status(201).json({ message: "Employee created", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.getAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.getById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.update(req.params.id, req.body);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User updated", user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.delete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted", user });
};
