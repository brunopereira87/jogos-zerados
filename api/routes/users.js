const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);

router.post("/forgotPassword", AuthController.forgotPassword);
router.patch("/resetPassword/:token", AuthController.resetPassword);

router.use(AuthController.protected);
router.post("/updateMyPassword", AuthController.updateMyPassword);

router.route("/games/", UserController.getUserGames);
router.patch("/updateMe", UserController.updateMe);
router.delete("/deleteMe", UserController.deleteMe);
module.exports = router;
