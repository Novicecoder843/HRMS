const designationModel = require("../models/designationModel");

// ➕ CREATE
exports.createDesignation = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { desig_name, dept_id, description } = req.body;

    // 🔍 DEBUG
    console.log("Creating designation:", desig_name, dept_id, company_id);

    // ✅ DEPARTMENT CHECK
    const deptExists = await designationModel.checkDepartment(dept_id, company_id);

    if (!deptExists) {
      return res.status(400).json({
        message: "Department does not belong to your company"
      });
    }

    // ✅ DUPLICATE CHECK
    const existing = await designationModel.findDesignationByName(
      desig_name,
      dept_id,
      company_id
    );

    if (existing) {
      return res.status(400).json({
        message: "Designation already exists in this department"
      });
    }

    await designationModel.createDesignation(
      desig_name,
      dept_id,
      description,
      company_id
    );

    res.status(201).json({
      message: "Designation created successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 📄 GET ALL
exports.getDesignations = async (req, res) => {
  const data = await designationModel.getDesignations(req.user.company_id);
  res.json(data);
};



// 🔍 GET BY ID
exports.getDesignationById = async (req, res) => {
  const data = await designationModel.getDesignationById(
    req.params.id,
    req.user.company_id
  );

  if (!data) {
    return res.status(404).json({
      message: "Designation not found"
    });
  }

  res.json(data);
};



// ✏️ UPDATE
exports.updateDesignation = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;
    const { desig_name, dept_id, description } = req.body;

    const existing = await designationModel.getDesignationById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Designation not found"
      });
    }

    const deptExists = await designationModel.checkDepartment(dept_id, company_id);

    if (!deptExists) {
      return res.status(400).json({
        message: "Department does not belong to your company"
      });
    }

    await designationModel.updateDesignation(
      id,
      desig_name,
      dept_id,
      description,
      company_id
    );

    res.json({
      message: "Designation updated successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ❌ DELETE
exports.deleteDesignation = async (req, res) => {
  const company_id = req.user.company_id;

  const existing = await designationModel.getDesignationById(
    req.params.id,
    company_id
  );

  if (!existing) {
    return res.status(404).json({
      message: "Designation not found"
    });
  }

  await designationModel.deleteDesignation(req.params.id, company_id);

  res.json({
    message: "Designation deleted successfully ✅"
  });
};