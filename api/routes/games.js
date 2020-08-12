const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/GamesController');
const imageMiddleware = require('../middlewares/imageMiddleware');
//const { validate } = require("../middlewares/validateFormMiddleware");

router
  .route('/')
  .get(GamesController.getAllGames)
  .post(
    //validate,
    GamesController.uploadGameImages,
    GamesController.createGame,
    GamesController.resizeGameImages,
    GamesController.updateGameImages
  );
router
  .route('/:id')
  .get(GamesController.getGame)
  .patch(
    GamesController.uploadGameImages,
    GamesController.updateGame,
    GamesController.resizeGameImages,
    GamesController.updateGameImages
  )
  .delete(GamesController.deleteGame);
module.exports = router;
