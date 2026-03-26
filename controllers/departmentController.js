const deptModel = require("../models/departmentModel");

// CREATE
exports.createDepartment = async (req, res) => {
  try {
    const { dept_name, description } = req.body;
    const company_id = req.user.id;

    if (!dept_name) {
      return res.status(400).json({
        message: "Department name required"
      });
    }

    // 🔥 DUPLICATE CHECK
    const existing = await deptModel.findDepartmentByName(
      dept_name,
      company_id
    );

    if (existing) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    const result = await deptModel.createDepartment({
      company_id,
      dept_name,
      description
    });

    res.status(201).json({
      message: "Department created",
      id: result.insertId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getDepartments = async (req, res) => {
  try {
    const company_id = req.user.id;

    const data = await deptModel.getDepartments(company_id);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ONE
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;

    const dept = await deptModel.getDepartmentById(id, company_id);

    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(dept);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dept_name, description } = req.body;
    const company_id = req.user.id;

    if (!dept_name && !description) {
      return res.status(400).json({
        message: "Nothing to update"
      });
    }

    // 🔥 CHECK EXIST
    const existing = await deptModel.getDepartmentById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    await deptModel.updateDepartment(
      id,
      company_id,
      dept_name,
      description
    );

    res.json({ message: "Department updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;

    const existing = await deptModel.getDepartmentById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    await deptModel.deleteDepartment(id, company_id);

    res.json({ message: "Department deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};