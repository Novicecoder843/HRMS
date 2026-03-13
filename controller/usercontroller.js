const User = require("../models/userModel");


// CREATE USER
exports.create = async (req,res)=>{

try{

const result = await User.createUser(req.body);

res.json({
message:"User created",
id:result.insertId
});

}catch(error){

res.status(500).json(error);

}

};


// GET ALL USERS
exports.getAll = async (req,res)=>{

try{

const users = await User.getAllUsers();

res.json(users);

}catch(error){

res.status(500).json(error);

}

};


// GET USER BY ID
exports.getById = async (req,res)=>{

try{

const user = await User.getUserById(req.params.id);

res.json(user);

}catch(error){

res.status(500).json(error);

}

};


// EDIT USER
exports.edit = async (req,res)=>{

try{

const user = await User.getUserById(req.params.id);

res.json(user);

}catch(error){

res.status(500).json(error);

}

};


// UPDATE USER
exports.update = async (req,res)=>{

try{

await User.updateUser(req.params.id,req.body);

res.json({
message:"User updated"
});

}catch(error){

res.status(500).json(error);

}

};


// DELETE USER
exports.delete = async (req,res)=>{

try{

await User.deleteUser(req.params.id);

res.json({
message:"User deleted"
});

}catch(error){

res.status(500).json(error);

}

};