const Department = require("../models/department.model");

exports.createDepartment = async (req, res) => {
  try {
    const { company_id, dept_name, manager_id } = req.body;

    if (!company_id || !dept_name) {
      return res.status(400).json({
        message: "company_id and dept_name are required"
      });
    }

    const department = await Department.create({
      company_id,
      dept_name,
      manager_id
    });

    res.status(201).json({
      message: "Department created",
      department
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.getAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.getById(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.update(req.params.id, req.body);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department updated", department });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.delete(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department deleted", department });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
