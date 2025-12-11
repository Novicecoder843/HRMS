


const userService = require("../Service/user.service");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


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
            password,
        } = req.body

        let newMobile = "91" + mobile;
        const hashPassword = await bcrypt.hash(password, 9);
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
            password: hashPassword

        });
        res.status(200).json({
            success: true,
            message: "User created succesfully",
            data: result || [],
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
            data: [],
        });
        return;
    }
};

//login user:-

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user if exist
        const user = await userService.getUserByEmail(email);
        console.log(user, 'user')
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
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
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
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
};

//Delete user by Id

// exports.deleteUser = async (req, res) => {
//      try {
//           const { id } = req.params;
//           const result = await userService.deleteUser(id);
//           if (result.length === 0) {
//                return res.status(404).json({
//                     success: false,
//                     message: "user not found",
//                     data: []
//                })
//           }
//           return res.status(200).json({
//                success: true,
//                message: "User deleted successfully",
//                data: [],
//           });
//      } catch (error) {
//           return res.status(500).json({
//                success: false,
//                message: error.message,
//                data: [],
//           });
//      } 
// }



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
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
};




