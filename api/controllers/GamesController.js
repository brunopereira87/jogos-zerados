const Game = require("../models/Game");
const slugify = require("slugify");
const APIFeature = require("../utils/APIFeature");
const { convertDate, stringToArray } = require("../helpers");

exports.getAllGames = async (req, res) => {
  try {
    //BUILDING QUERY
    const feature = new APIFeature(Game.find().populate(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //EXECUTE QUERY
    const games = await feature.query;
    //SEND RESPONSE
    res.status(200).json({
      success: true,
      results: games.length,
      games
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getGame = async (req, res) => {
  try {
    const id = req.params.id;

    const game = await Game.findOne({ _id: id });

    if (game) {
      res.status(200).json({
        success: true,
        game: game
      });
    } else {
      res.status(404).json({
        success: false,
        message: "O jogo não foi encontrado"
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.createGame = async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true });
    const result = await Game.findOne(
      { slug: slug },
      { plataform: req.body.plataform }
    );

    if (result) {
      return res.status(409).json({
        success: false,
        message: "Jogo já cadastrado"
      });
    }

    req.body.slug = slug;
    req.body.release_date = req.body.release_date
      ? convertDate(req.body.release_date)
      : null;

    if (req.body.styles) req.body.styles = stringToArray(req.body.styles, ",");

    if (req.files) {
      if (req.files.screenshots.length > 0)
        req.body.screenshots = getImagesPath(req.files.screenshots);

      if (req.files.artbox.length > 0)
        req.body.artbox = req.files.artbox[0].path;
    }

    const newGame = await Game.create(req.body);
    res.status(201).json({
      success: true,
      message: "Jogo cadastrado com sucesso",
      game: newGame
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const id = req.params.id;

    const game = await Game.deleteOne({ _id: id });
    if (game) {
      res
        .status(200)
        .json({ success: true, message: "Jogo deletado com sucesso" });
    } else {
      res.status(404).json({ message: "Jogo não encontrado", success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
const getImagesPath = images => {
  return images.map(image => image.path);
};
