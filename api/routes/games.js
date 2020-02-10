const express = require("express");
const router = express.Router();
const GamesController = require("../controllers/GamesController");
const imageMiddleware = require("../middlewares/imageMiddleware");
//const { validate } = require("../middlewares/validateFormMiddleware");

router
  .route("/")
  .get(GamesController.getAllGames)
  .post(
    //validate,
    imageMiddleware.upload.fields([
      { name: "artbox", maxCount: 1 },
      { name: "screenshots", maxCount: 16 }
    ]),
    //imageMiddleware.upload.array("screenshots"),
    GamesController.createGame
  );
router
  .route("/:id")
  .get(GamesController.getGame)
  .delete(GamesController.deleteGame);
module.exports = router;
