const roleModel = require("../models/roleModel");

// ➕ CREATE ROLE
exports.createRole = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { role_name } = req.body;
 
    // check duplicate
    const existing = await roleModel.findRoleByName(role_name, company_id);

    if (existing) {
      return res.status(400).json({
        message: "Role already exists in your company"
      });
    }

    await roleModel.createRole(role_name, company_id);

    res.status(201).json({
      message: "Role created successfully ✅"
    });
  
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 📄 GET ALL ROLES
exports.getRoles = async (req, res) => {
  try {
    const company_id = req.user.company_id;

    const roles = await roleModel.getRoles(company_id);

    res.json(roles);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔍 GET ROLE BY ID
exports.getRoleById = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;

    const role = await roleModel.getRoleById(id, company_id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.json(role);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✏️ UPDATE ROLE
exports.updateRole = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;
    const { role_name } = req.body;

    const role = await roleModel.getRoleById(id, company_id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    await roleModel.updateRole(id, role_name, company_id);

    res.json({
      message: "Role updated successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ❌ DELETE ROLE
exports.deleteRole = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { id } = req.params;

    const role = await roleModel.getRoleById(id, company_id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    await roleModel.deleteRole(id, company_id);

    res.json({
      message: "Role deleted successfully ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};