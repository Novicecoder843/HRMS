
const userService = require("../Service/user.service");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { success } = require("zod");
const xlsx = require("xlsx");
const path = require("path");
const ExcelJS = require("exceljs");
const fs = require('fs');




//Creat User
// exports.createUser = async (req, res) => {
//      try {
//           const {
//                name,
//                company_id,
//                email,
//                mobile,      // Get the raw number from Postman
//                designation,
//                role_id,
//                address,
//                city,
//                pincode,
//                password,
//           } = req.body;

//           // 1. Capture image path
//           let profileImagePath = req.file ? req.file.path : null;

//           // 2. Format the mobile number
//           let formattedMobile = "91" + mobile;

//           // 3. Hash the password
//           const hashPassword = await bcrypt.hash(password, 9);

//           // 4. Pass the CORRECT variables to the service
//           const result = await userService.createUser({
//                name,
//                company_id,
//                email,
//                mobile: formattedMobile, // Use the one with "91"
//                designation,
//                role: role_id,           // Match the key 'role' used in your service
//                address,
//                city,
//                pincode,
//                password: hashPassword,
//                profile_image: profileImagePath
//           });

//           res.status(200).json({
//                success: true,
//                message: "User created successfully",
//                data: result || [],
//           });
//      } catch (error) {
//           console.log(error);
//           res.status(500).json({
//                success: false,
//                message: error.message,
//                data: [],
//           });
//      }
// };

// user.controller.js

exports.createUser = async (req, res) => {
     try {
          const {
               name, company_id, email, mobile,
               designation, role_id, address, city,
               pincode, password
          } = req.body;

          // 1. Check if file was uploaded
          const profileImagePath = req.file ? req.file.path : null;

          // 2. Data Formatting
          const formattedMobile = mobile.startsWith("91") ? mobile : "91" + mobile;
          const hashPassword = await bcrypt.hash(password, 9);

          // 3. Call Service
          const result = await userService.createUser({
               name,
               company_id,
               email,
               mobile: formattedMobile,
               designation,
               role_id, // Passed as is, service will map to DB column
               address: address || "",
               city: city || "",
               pincode: pincode || null,
               password: hashPassword,
               profile_image: profileImagePath
          });

          res.status(201).json({
               success: true,
               message: "User created successfully",
               data: result
          });

     } catch (error) {
          // 🚨 CLEANUP: If DB fails, delete the uploaded file
          if (req.file) {
               fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file after DB failure:", err);
               });
          }

          console.error("Controller Error:", error);
          res.status(500).json({
               success: false,
               message: error.message || "Internal Server Error",
          });
     }
};





// upload data
exports.uploadUsers = async (req, res) => {
     try {
          if (!req.file) {
               return res.status(400).json({
                    success: false,
                    message: "Please upload an excel file",
               });
          }

          const workbook = xlsx.readFile(req.file.path);
          const sheetName = workbook.SheetNames[0];
          const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
          console.log(excelData,'excelDataexcelData')

          if (excelData.length === 0) {
               return res.status(400).json({
                    success: false,
                    message: "Excel sheet is empty",
               });
          }

          const processData = [];
          const errors = [];

          console.log(excelData,'excelDataexcelData')

          for (const [index, row] of excelData.entries()) {
               try {
                    if (!row.email || !row.name || !row.company_name) {
                         throw new Error("Missing required fields (email, name, or company_name)");
                    }

                    const result = await userService.processExcelRow(row);
                    processData.push(result);
               } catch (err) {
                    errors.push({
                         rowNumber: index + 2,
                         name: row.user_name,
                         error: err.message,
                    });
               }
          }

          fs.unlinkSync(req.file.path);

          res.status(200).json({
               success: true,
               message: "Excel upload process completed",
               total: excelData.length,
               success_count: processData.length,
               failure_count: errors.length,
               errors: errors,
          });
     } catch (err) {
          if (req.file) fs.unlinkSync(req.file.path);
          res.status(500).json({
               success: false,
               message: err.message,
          });
     }
};


//Download file


exports.downloadUsersDetailedExcel = async (req, res) => {
     try {
          const users = await userService.getAllUsersWithDetails();

          if (!users || users.length === 0) {
               return res.status(404).json({ success: false, message: "No data found" });
          }

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Users List");

          worksheet.columns = [
               { header: "Employee Name", key: "name", width: 25 },
               { header: "Email ID", key: "email", width: 30 },
               { header: "Mobile No.", key: "mobile", width: 15 },
               { header: "Designation", key: "designation", width: 20 },
               { header: "Company Name", key: "company_name", width: 25 },
               { header: "Department", key: "department_name", width: 20 },
               { header: "Role", key: "role_name", width: 20 },
          ];

          worksheet.addRows(users);
          worksheet.getRow(1).font = { bold: true };

          // --- File Format Fix ---
          const fileName = "Users_Detailed_Report.xlsx";
          res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

          // Browser ko batana ki file excel hai
          res.attachment(fileName);

          await workbook.xlsx.write(res);
          res.end();

     } catch (err) {
          res.status(500).json({ success: false, message: "Error: " + err.message });
     }
};

//login user:-

exports.loginUser = async (req, res) => {
     try {
          const { email, password } = req.body;

          // check user if exist
          const user = await userService.getUserByEmail(email);
          console.log(user,'user')
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               });
          }
          // 2. Check if user account is inactive / deleted
          if (user.status === false && user.deleted_at != null) {
               return res.status(403).json({
                    success: false,
                    message: "User is inactive, please contact admin"
               });
          }

          // check password

          const isMatch = await bcrypt.compare(password, user.password);
          console.log("password:", password);

          if (!isMatch) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid password",
               });
          }

          // create JWT token
          // const token = jwt.sign(
          //      {
          //           id: user.id || user.employee_id || user.user_id,                
          //           email: user.email,
          //           company_id: user.company_id,
          //      },
          //      process.env.JWT_SECRET || "secret123",
          //      { expiresIn: "24h" }
          // );
          
          // In your Login Controller - update the token generation
          const tokenPayload = {
               // Forcefully check every possible ID name from your database
               id: user.id || user.employee_id || user.user_id,
               email: user.email,
               company_id: user.company_id
          };

          // CRITICAL DEBUG: Check your terminal after logging in
          console.log("DEBUG: This is what is being put in the token:", tokenPayload);

          const token = jwt.sign(
               tokenPayload,
               process.env.JWT_SECRET || "secret123",
               { expiresIn: "48h" }
          );



          // success response
          return res.status(200).json({
               success: true,
               message: "Login successful",
               token,
               user,
          });

     } catch (error) {
          console.log(error)
          return res.status(500).json({
               success: false,
               message: error.message,
          });
     }
    
};


exports.changePassword = async (req, res) => {
     try {
          const { email, newPassword } = req.body;

          if (!email || !newPassword) {
               return res.status(400).json({
                    success: false,
                    message: "Email and newPassword are required",
               });
          }

          const user = await userService.getUserByEmail(email);
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               });
          }

          console.log("USER OBJECT:", user);

          // ✅ THIS is your ID
          const employeeId = user.employee_id;
          console.log("Fetched User ID:", employeeId);

          const hashedPassword = await bcrypt.hash(newPassword, 9);

          const updatedUser = await userService.updateUserPassword(
               employeeId,
               hashedPassword
          );

          return res.status(200).json({
               success: true,
               message: "Password updated successfully",
          });
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               success: false,
               message: error.message,
          });
     }
};


//Read All
// read All by pagination

exports.getAllUsers = async (req, res) => {
     try {
          // 1️⃣ Get page & limit from query params
          let page = parseInt(req.query.page) || 1;  // default page = 1
          let limit = parseInt(req.query.limit) || 10; // default limit = 10

          // 2️⃣ Calculate offset
          const offset = (page - 1) * limit;

          // 3️⃣ Call service with limit & offset
          const result = await userService.getAllUsers(limit, offset);

          // 4️⃣ Add page to result and send response
          res.status(200).json({
               success: true,
               page,
               ...result,  // limit, total, totalPages, data
               message: "Users fetched successfully"
          });

     } catch (error) {
          console.log(error);
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};



//Read by ids

exports.getUserById = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await userService.getUserBYId(id);

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
               data: result,
          });
     } catch (error) {
          console.log(error)
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

// update user by id

exports.UpdateUser = async (req, res) => {
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

          // If a new file is uploaded, add the path to our update object
          if (req.file) {
               updateData.profile_image = req.file.path;
          }
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
                    message: "user not found",
                    data: result[0],
               });
          }

          return res.status(200).json({
               success: true,
               message: "user update sucessfully",
               data: [],
          });
     } catch (err) {
          console.log(err);
          
          return res.status(500).json({
               success: false,
               message: err.message,
               data: [],
          });
     }
};

//Delete user by Id

exports.deleteUser = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await userService.deleteUser(id);
          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "user not found",
                    data: []
               })
          }
          return res.status(200).json({
               success: true,
               message: "User deleted successfully",
               data: [],
          });
     } catch (err) {
          console.log(err);

          return res.status(500).json({
               success: false,
               message: err.message,
               data: [],
          });
     } 
}



exports.softDeleteuser = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await userService.softDeleteuser(id);
          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "user not found",
                    data: []
               })
          }
          return res.status(200).json({
               success: true,
               message: "user deleted successfully",
               data: [],
          });
     } catch (err) {
          console.log(err);
          
          return res.status(500).json({
               success: false,
               message: err.message,
               data: [],
          });
     }
};



