const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");

router.post("/create", companyController.create);
router.get("/getall", companyController.getAll);
router.get("/getbyid/:id", companyController.getById);
router.put("/update/:id", companyController.update);
router.delete("/delete/:id", companyController.delete);

module.exports = router;