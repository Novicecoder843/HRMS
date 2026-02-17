const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth_middleware");
const userController = require("../Controller/user.controller");

const uploads = require("../middlewares/upload_middleware");
const multer = require('multer');
const upload = multer({ dest: 'upload/' })

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role_id:
 *           type: integer
 *         department_id:
 *           type: integer
 *         designation_id:
 *           type: integer
 *         profile_image:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - old_password
 *         - new_password
 *       properties:
 *         old_password:
 *           type: string
 *         new_password:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/user/upload-users:
 *   post:
 *     summary: Upload users from Excel file
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Users uploaded successfully
 */
router.post('/upload-users', upload.single('file'), userController.uploadUsers);

/**
 * @swagger
 * /api/v1/user/download-detailed:
 *   get:
 *     summary: Download detailed users Excel report
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Excel file downloaded
 */
router.get("/download-detailed", userController.downloadUsersDetailedExcel);

const {
     ValidateCreateUser,
     ValidateUpdateUser,
     ValidateReadUser,
     ValidateDeleteUser
} = require("../middlewares/user_middleware");

/**
 * @swagger
 * /api/v1/user/adduser:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               department_id:
 *                 type: integer
 *               designation_id:
 *                 type: integer
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/adduser", upload.single('profile_image'), ValidateCreateUser, userController.createUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /api/v1/user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post("/change-password", userController.changePassword);

/**
 * @swagger
 * /api/v1/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get("/all", userController.getAllUsers);

router.get(
     "/all",
     ValidateReadUser,
     userController.getAllUsers
);

/**
 * @swagger
 * /api/v1/user/user/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
     "/user/:id",
     uploads.single('profile_image'),
     ValidateUpdateUser,
     userController.UpdateUser
);

/**
 * @swagger
 * /api/v1/user/user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
     "/user/:id",
     ValidateDeleteUser,
     userController.deleteUser
);

/**
 * @swagger
 * /api/v1/user/user/soft/{id}:
 *   delete:
 *     summary: Soft delete user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 */
router.delete("/user/soft/:id", userController.softDeleteuser);

module.exports = router;
