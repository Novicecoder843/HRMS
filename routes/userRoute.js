const router = require("express").Router();
const controller = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/roleMiddleware");

router.post("/createuser", protect, checkPermission("CREATE_USER"), controller.createUser);

router.post("/loginuser", controller.login);

router.get("/allusers", protect, checkPermission("VIEW_USERS"), controller.getUsers);

router.get("/employees", protect, checkPermission("VIEW_EMPLOYEES"), controller.getEmployees);

router.get("/myteam", protect, checkPermission("VIEW_ASSIGNED_EMPLOYEES"), controller.getMyTeam);

router.get("/me", protect, controller.getMyProfile);

router.put("/updateprofile", protect, checkPermission("UPDATE_PROFILE"), controller.updateMyProfile);

module.exports = router;