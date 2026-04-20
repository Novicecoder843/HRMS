const express = require("express");
const router = express.Router();

const designationController = require("../controllers/designationController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const {createDesignationSchema,updateDesignationSchema} = require("../validations/designationValidation");

// CREATE
router.post("/create",verifyToken,validate(createDesignationSchema),designationController.createDesignation);

// GET ALL
router.get("/",verifyToken,designationController.getDesignations);

// GET BY ID
router.get("/:id",verifyToken,designationController.getDesignationById);

// UPDATE
router.put("/:id",verifyToken,validate(updateDesignationSchema),designationController.updateDesignation);

// DELETE
router.delete("/:id",verifyToken,designationController.deleteDesignation);

module.exports = router;