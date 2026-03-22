const roleModel = require("../models/roleModel");

// ✅ CREATE ROLE
exports.createRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    const company_id = req.user.id;

    if (!role_name) {
      return res.status(400).json({
        message: "Role name is required"
      });
    }

    const existingRole = await roleModel.findRole(role_name, company_id);

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists"
      });
    }

    await roleModel.createRole(role_name, company_id);

    res.status(201).json({
      message: "Role created successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET ALL ROLES
exports.getRoles = async (req, res) => {
  try {
    const company_id = req.user.id;

    const roles = await roleModel.getRoles(company_id);

    res.json({
      roles
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET ROLE BY ID OR NAME
exports.getRole = async (req, res) => {
  try {
    const value = req.params.value;
    const company_id = req.user.id;

    let role;

    if (!isNaN(value)) {
      role = await roleModel.getRoleById(value, company_id);
    } else {
      role = await roleModel.getRoleByName(value, company_id);
    }

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.json({
      role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};