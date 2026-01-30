const Designation = require("../models/designation.model");

exports.createDesignation = async (req, res) => {
  try {
    const { name, level, company_id } = req.body;

    if (!name || !level || !company_id) {
      return res.status(400).json({
        message: "name, level and company_id are required"
      });
    }

    const designation = await Designation.create({
      name,
      level,
      company_id
    });

    res.status(201).json({
      message: "Designation created",
      designation
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.getAll();
    res.json(designations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDesignationById = async (req, res) => {
  try {
    const designation = await Designation.getById(req.params.id);
    if (!designation)
      return res.status(404).json({ message: "Designation not found" });

    res.json(designation);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateDesignation = async (req, res) => {
  try {
    const designation = await Designation.update(req.params.id, req.body);
    if (!designation)
      return res.status(404).json({ message: "Designation not found" });

    res.json({ message: "Designation updated", designation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteDesignation = async (req, res) => {
  try {
    const designation = await Designation.delete(req.params.id);
    if (!designation)
      return res.status(404).json({ message: "Designation not found" });

    res.json({ message: "Designation deleted", designation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
