const departmentModel = require("../models/departmentModel");

// ➕ CREATE
exports.createDepartment = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { dept_name, description } = req.body;

    // check duplicate
    const existing = await departmentModel.findDepartmentByName(
      dept_name,
      company_id
    );

    if (existing) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    await departmentModel.createDepartment(
      dept_name,
      description,
      company_id
    );

    res.status(201).json({
      message: "Department created successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 📄 GET ALL
exports.getDepartments = async (req, res) => {
  try {
    const company_id = req.user.company_id;

    const data = await departmentModel.getDepartments(company_id);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔍 GET BY ID
exports.getDepartmentById = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;

    const data = await departmentModel.getDepartmentById(id, company_id);

    if (!data) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✏️ UPDATE
exports.updateDepartment = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;
    const { dept_name, description } = req.body;

    const existing = await departmentModel.getDepartmentById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    await departmentModel.updateDepartment(
      id,
      dept_name,
      description,
      company_id
    );

    res.json({
      message: "Department updated successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ❌ DELETE
exports.deleteDepartment = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;

    const existing = await departmentModel.getDepartmentById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    await departmentModel.deleteDepartment(id, company_id);

    res.json({
      message: "Department deleted successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};