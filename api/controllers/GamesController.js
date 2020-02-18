const Game = require("../models/Game");
const slugify = require("slugify");
const APIFeature = require("../utils/APIFeature");
const { convertDate, stringToArray } = require("../helpers");

exports.getAllGames = async (req, res) => {
  try {
    //BUILDING QUERY
    const feature = new APIFeature(Game.find(), req.query)
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

exports.getGame = (req, res) => {
  const id = req.params.id;

  Game.findOne({ _id: id })
    .exec()
    .then(doc => {
      if (doc) {
        res.status.json({
          success: true,
          game: doc
        });
      } else {
        res.status(404).json({
          success: false,
          message: "O jogo não foi encontrado"
        });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.createGame = (req, res) => {
  const slug = slugify(req.body.name, { lower: true });
  Game.findOne({ slug: slug }, { plataform: req.body.plataform })
    .exec()
    .then(result => {
      if (result) {
        return res.status(409).json({
          success: false,
          message: "Jogo já cadastrado"
        });
      }
    });
  req.body.slug = slug;
  req.body.release_date = req.body.release_date
    ? convertDate(req.body.release_date)
    : null;

  req.body.styles = stringToArray(req.body.styles, ",");
  req.body.screenshots = getImagesPath(req.files.screenshots);
  req.body.artbox = req.files.artbox[0].path;

  const game = new Game(req.body);
  game
    .save()
    .then(() =>
      res
        .status(201)
        .json({ success: true, message: "Jogo cadastrado com sucesso" })
    )
    .catch(err => res.status(500).json({ error: err }));
  res
    .status(201)
    .json({ success: true, message: "Jogo cadastrado com sucesso" });
};

exports.deleteGame = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Game.deleteOne({ _id: id })
    .then(() =>
      res
        .status(200)
        .json({ success: true, message: "Jogo deletado com sucesso" })
    )
    .catch(err => res.status(500).json({ error: err }));
};
const getImagesPath = images => {
  return images.map(image => image.path);
};
