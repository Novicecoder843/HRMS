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

//Read All by pagination
exports.getAllUsers = async (req, res) => {
  try {
    let page=parseInt(req.query.page)|| 1;
    let limit = parseInt(req.query.limit)||10;

    let offset =(page-1)*limit;

    const users = await userService.getAllUsers(page, limit);
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      ...users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message});
  }
}
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

//Bulk user insert
exports.bulkInsertUsers = async (req, res) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "users array is required",
      });
    }
    const result = await userService.bulkInsertUsers(users);

    return res.status(201).json({
      success: true,
      message: `${result.rowCount} users inserted successfully`,
      rowCount: result.rowCount,
    });
  } catch (err) {
    console.error("bulkInsertUsers Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
