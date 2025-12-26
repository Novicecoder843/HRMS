const userService = require("../Service/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { success } = require("zod");
const companyService = require("../Service/company.service");
const xlsx=require('xlsx')
const fs=require('fs')

// const generateEmpCode = async (companyName, companyId) => {
//   const prefix = companyName.substring(0, 3).toUpperCase();
//   const newSequenceNumber = await userService.getNextEmpSequence(
//     prefix,
//     companyId
//   );
//   const sequencePart = String(newSequenceNumber).padStart(4, "0");
//   return `${prefix}${sequencePart}`;
// };

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
      dept_id,
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

    const company = await companyService.getCompanyById(company_id);

    if (!company || !company.name) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID provided.",
      });
    }
    const prefix = company.name.substring(0, 3).toUpperCase();
    const newSequenceNumber = await userService.getNextEmpSequence(
      prefix,
      company_id
    );
    const sequencePart = String(newSequenceNumber).padStart(4, "0");
    const empCode = `${prefix}${sequencePart}`;

    // const empCode = await generateEmpCode(company.name, company_id);
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
      emp_code: empCode,dept_id,
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

//upload user by excel
exports.uploadUsers=async(req,res)=>{
  try {
    if(!req.file){
      return res.status(400).json({
        success:false,
        message:"Please upload an excel file"
      })
    }

    const workbook=xlsx.readFile(req.file.path);
    const sheetName=workbook.SheetNames[0];
    const excelData =xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if(excelData.length===0){
      return res.status(400).json({
        success: false,
        message:"Excel sheet is empty"
      })
    }

    const processData =[];
    const errors=[];

    

    for(const [index,row] of excelData.entries()){
      try {
        if(!row.email || !row.user_name || !row.company_name){
         throw new Error("Missing required fields (email, name, or company)")
        }

        const result=await userService.processExcelRow(row);
        processData.push(result);
      } catch (err) {
        errors.push({
          rowNumber:index+2,
          name:row.user_name,
          error:err.message
        })
      }
    }

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success:true,
      message:"Excel upload process completed",
      total:excelData.length,
      success_count:processData.length,
      failure_count:errors.length,
      errors:errors
    })
  } catch (err) {
    if(req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}

//Read All by pagination
exports.getAllUsers = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let companyId = req.query.company_id || null;

    let offset = (page - 1) * limit;

    const users = await userService.getAllUsers(page, limit, companyId);
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
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or inactive",
        data: null, // Yahan data null ya {} rakhein
      });
    }

    res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: user,
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
      pincode,dept_id
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
      pincode,dept_id
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

    const processedUsers = [];
    const nextSequenceMap = {};
    const reversedUsers = [...users].reverse();

    for (const u of reversedUsers) {
      if (!u.company_id || !u.password) {
        throw new Error(
          `User ${u.email || u.name} is missing company_id or password.`
        );
      }

      let newMobile = "91" + u.mobile;

      const company = await companyService.getCompanyById(u.company_id);
      if (!company || !company.name) {
        throw new Error(
          `Invalid company ID ${u.company_id} for user ${u.email}.`
        );
      }

      const prefix = company.name.substring(0, 3).toUpperCase();
      const companyKey = u.company_id;

      if (!nextSequenceMap[companyKey]) {
        const initialSequence = await userService.getNextEmpSequence(
          prefix,
          companyKey
        );
        nextSequenceMap[companyKey] = initialSequence;
      }

      const currentSequence = nextSequenceMap[companyKey];

      const sequencePart = String(currentSequence).padStart(4, "0");
      const empCode = `${prefix}${sequencePart}`;

      nextSequenceMap[companyKey] = currentSequence + 1;

      // const empCode = await generateEmpCode(company.name, u.company_id);

      const hashPassword = await bcrypt.hash(u.password, 10);

      processedUsers.push({
        ...u,
        mobile: newMobile,
        password: hashPassword,
        emp_code: empCode,
        status: "active",
        dept_id:u.dept_id||null
      });
    }
    const usersToInsert = processedUsers.reverse();
    const result = await userService.bulkInsertUsers(usersToInsert);
    

    return res.status(201).json({
      success: true,
      message: `${result.rowCount} users inserted successfully`,
      rowCount: result.rowCount,
      data:result.rows,
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
      success: false,
      message: err.message,
    });
  }
};
