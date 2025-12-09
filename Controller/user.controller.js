const userService = require("../Service/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { success } = require("zod");

//Creat User
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      company_id,
      email,
      mobile,
      designation,
      role_id,
      address,
      city,
      pincode,
      password,
    } = req.body;
    let newMobile = "91" + mobile;

    // Check if email already exists
    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check if mobile already exists
    const existingMobile = await userService.getUserByMobile(newMobile);
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await userService.createUser({
      name,
      company_id,
      email,
      mobile: newMobile,
      designation,
      role_id,
      address,
      city,
      pincode,
      password: hashPassword,
    });
    res.status(200).json({
      success: true,
      message: "User created succesfully",
      data: result,
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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let companyId=req.query.company_id||null;

    let offset = (page - 1) * limit;

    const users = await userService.getAllUsers(page, limit,companyId);
    res.status(200).json({
      success: true,
      message: "Active users fetched successfully",
      ...users,
    });
  } catch (error) {
    return res.status(500).json({
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

    if (!result || result.length === 0 || result[0].status === "inactive") {
      return res.status(404).json({
        success: false,
        message: "User not found or inactive",
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
      role_id,
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
      role_id,
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

//Login
//authentication and authorization
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user if exist by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === "inactive" && user.deleted_at !== null) {
      return res.status(403).json({
        success: false,
        message: "Your account is inacive,Contact admin",
      });
    }

    //check password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }
    delete user.password;
    //create jwt
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//soft delete user
exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await userService.softDeleteUser(userId);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User  deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Reset password request
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the email is registered, a password reset link has been sent.",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000);
    await userService.saveResetToken(email, resetToken, tokenExpiry);
    return res.status(200).json({
      success: true,
      message: "Password reset token generated and sent (Check email).",
      dev_token: resetToken,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;
    const user = await userService.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }
    const newHashPassword = await bcrypt.hash(new_password, 10);

    await userService.updatePasswordAndClearToken(user.id, newHashPassword);
    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
   
  } catch (err) {
     return res.status(500).json({
      success:false,
      message:err.message
    })
  }
};
