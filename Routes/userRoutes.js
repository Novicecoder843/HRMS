const express = require("express");

const router = express.Router();

const userController =require("../controller/usercontroller");

router.post("/create", userController.create);
router.get("/getall", userController.getAll);
router.get("/getbyid/:id", userController.getById);
router.get("/edit/:id", userController.edit);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.delete);

module.exports = router;