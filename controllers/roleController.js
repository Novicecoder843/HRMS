const roleModel = require("../models/roleModel");

exports.createRole = async (req, res) => {

 try {

  const { role_name, company_id } = req.body;

  const existingRole = await roleModel.findRole(role_name, company_id);

  if (existingRole) {
   return res.status(400).json({
    message: "Role already exists"
   });
  }

  await roleModel.createRole(req.body);

  res.json({
   message: "Role created successfully"
  });

 } catch (err) {

  res.status(500).json(err);

 }

};


// Get all roles
exports.getRoles = async (req, res) => {

 try {

  const roles = await roleModel.getRoles();

  res.json(roles);

 } catch (err) {

  res.status(500).json(err);

 }

};


// Get role by id OR name
exports.getRole = async (req, res) => {

 try {

  const value = req.params.value;

  let role;

  if (!isNaN(value)) {
   role = await roleModel.getRoleById(value);
  } else {
   role = await roleModel.getRoleByName(value);
  }

  if (!role) {
   return res.status(404).json({
    message: "Role not found"
   });
  }

  res.json(role);

 } catch (err) {

  res.status(500).json({
   message: err.message
  });

 }

};