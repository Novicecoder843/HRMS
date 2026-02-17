const express = require('express');
const router = express.Router();
const { authenticate } = require("../middlewares/auth_middleware");

const companyController = require("../Controller/company.controller");

const {
     ValidateCreateCompany,
     ValidateReadCompany,
     ValidateUpdateCompany,
     ValidateDeleteCompany
} = require("../middlewares/company_middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 *     CreateCompanyRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/company/create:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyRequest'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 */
router.post(
     "/create",
     authenticate,
     ValidateCreateCompany,
     companyController.createCompany
);

/**
 * @swagger
 * /api/v1/company/all:
 *   get:
 *     summary: Get all companies
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all companies
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
 *                     $ref: '#/components/schemas/Company'
 */
router.get(
     "/all",
     authenticate,
     companyController.getAllCompany
);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get("/:id", authenticate, ValidateReadCompany, companyController.getCompanyById);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   put:
 *     summary: Update company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyRequest'
 *     responses:
 *       200:
 *         description: Company updated successfully
 */
router.put(
     "/:id",
     authenticate,
     ValidateUpdateCompany,
     companyController.UpdateCompany
);

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Delete company by ID
 *     tags: [Company]
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
 *         description: Company deleted successfully
 */
router.delete("/:id", authenticate, ValidateDeleteCompany, companyController.deleteCompany);

/**
 * @swagger
 * /api/v1/company/delete/{id}:
 *   delete:
 *     summary: Soft delete company by ID
 *     tags: [Company]
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
 *         description: Company soft deleted successfully
 */
router.delete('/delete/:id', companyController.softDeleteCompany)

module.exports = router;
