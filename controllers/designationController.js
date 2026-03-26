const desigModel = require("../models/designationModel");
const db = require("../config/db");

// ✅ CREATE
exports.createDesignation = async (req, res) => {
  try {
    const { department_id, desig_name, description } = req.body;
    const company_id = req.user.id;

    if (!desig_name) {
      return res.status(400).json({
        message: "Designation name required"
      });
    }

    // 🔥 VALIDATE DEPARTMENT (if provided)
    if (department_id) {
      const [dept] = await db.query(
        `SELECT * FROM departments 
         WHERE id = ? AND company_id = ?`,
        [department_id, company_id]
      );

      if (dept.length === 0) {
        return res.status(400).json({
          message: "Invalid department"
        });
      }
    }

    // 🔥 DUPLICATE CHECK
    const existing = await desigModel.findDesignation(
      desig_name,
      department_id,
      company_id
    );

    if (existing) {
      return res.status(400).json({
        message: "Designation already exists"
      });
    }

    const result = await desigModel.createDesignation({
      company_id,
      department_id,
      desig_name,
      description
    });

    res.status(201).json({
      message: "Designation created",
      id: result.insertId
    });

  } catch (err) {

    // 🔥 HANDLE DB DUPLICATE ERROR
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Designation already exists"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

// GET ALL Designation by Department id
exports.getDesignations = async (req, res) => {
  try {
    const company_id = req.user.id;
    const { department_id } = req.params; 

    const data = await desigModel.getDesignations(company_id, department_id);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE Designation by ID

exports.getDesignationById = async (req, res) => {
  try {
    const company_id = req.user.id;
    const { id } = req.params;

    const data = await desigModel.getDesignationById(id, company_id);

    if (!data) {
      return res.status(404).json({
        message: "Designation not found"
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//UPDATE (SAFE)
exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { desig_name, description, department_id } = req.body;
    const company_id = req.user.id;

    // 🔥 CHECK EXIST
    const existing = await desigModel.getDesignationById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Designation not found"
      });
    }

    // 🔥 DUPLICATE CHECK (if name updated)
    if (desig_name) {
      const duplicate = await desigModel.findDesignation(
        desig_name,
        department_id || existing.department_id,
        company_id
      );

      if (duplicate && duplicate.id !== parseInt(id)) {
        return res.status(400).json({
          message: "Designation already exists"
        });
      }
    }

    await desigModel.updateDesignation(
      id,
      company_id,
      desig_name || existing.desig_name,
      description || existing.description,
      department_id || existing.department_id
    );

    res.json({ message: "Designation updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ DELETE (SAFE)
exports.deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;

    const existing = await desigModel.getDesignationById(id, company_id);

    if (!existing) {
      return res.status(404).json({
        message: "Designation not found"
      });
    }

    await desigModel.deleteDesignation(id, company_id);

    res.json({ message: "Designation deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};