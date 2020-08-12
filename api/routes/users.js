const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const GameController = require('../controllers/GamesController');
router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);

router.post("/forgotPassword", AuthController.forgotPassword);
router.patch("/resetPassword/:token", AuthController.resetPassword);

router.use(AuthController.protected);
router.post("/updateMyPassword", AuthController.updateMyPassword);

router
    .route("/games")
    .get(UserController.getUserGames);

router
    .route('/games/:game_id')
    .post(UserController.addGame)
    .patch(UserController.changeReview)
    .delete(UserController.removeGame);
router.patch("/updateMe", UserController.updateMe);
router.delete("/deleteMe", UserController.deleteMe);

// router
//     .route(':user_id/games')
//     .get(GameController.getAllGames)
//     .post(GameController.addGame)
module.exports = router;
