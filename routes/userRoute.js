const router = require("express").Router();
const controller = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/createuser", controller.createUser);

router.post("/loginuser", controller.login);

router.get("/getallusers", protect, controller.getUsers);


module.exports = router;