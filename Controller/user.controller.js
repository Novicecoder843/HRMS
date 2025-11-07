const userService = require("../Service/user.service");

//Creat User
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      company_id,
      email,
      mobile,
      designation,
      role,
      address,
      city,
      pincode,
    } = req.body;
    let newMobile = "91" + mobile;
    const result = await userService.createUser({
      name,
      company_id,
      email,
      mobile,
      designation,
      role,
      address,
      city,
      pincode,
    });
    res.status(200).json({
      success: true,
      message: "User created succesfully",
      data: result || [],
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
    return;
  }
};

//Read All
exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Read by ids
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(id);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      company_id,
      email,
      mobile,
      designation,
      role,
      address,
      city,
      pincode,
    } = req.body;

    const result = await userService.updateUser(id, {
      name,
      company_id,
      email,
      mobile,
      designation,
      role,
      address,
      city,
      pincode,
    });

    if (!result || result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "User update successfully",
      data: result[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

//Delete user by id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUser(id);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
        date: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};
