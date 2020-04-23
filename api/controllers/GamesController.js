const Game = require("../models/Game");
const slugify = require("slugify");
const APIFeature = require("../utils/APIFeature");
const { convertDate, stringToArray } = require("../helpers");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllGames = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(Game.find().populate(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //EXECUTE QUERY
  const games = await feature.query;
  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: games.length,
    games
  });
});

exports.getGame = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const game = await Game.findOne({ _id: id });

  if (!game) {
    return next(new AppError("O jogo não foi encontrado", 404));
  }
  res.status(200).json({
    status: "success",
    game: game
  });
});

exports.createGame = catchAsync(async (req, res, next) => {
  const slug = slugify(req.body.name, { lower: true });
  const result = await Game.findOne(
    { slug: slug },
    { plataform: req.body.plataform }
  );

  if (result) {
    return next(new AppError("Jogo já cadastrado", 409));
  }

  req.body.slug = slug;
  req.body.release_date = req.body.release_date
    ? convertDate(req.body.release_date)
    : null;

  if (req.body.styles) req.body.styles = stringToArray(req.body.styles, ",");

  if (req.files) {
    if (req.files.screenshots.length > 0)
      req.body.screenshots = getImagesPath(req.files.screenshots);

    if (req.files.artbox.length > 0) req.body.artbox = req.files.artbox[0].path;
  }

  const newGame = await Game.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Jogo cadastrado com sucesso",
    game: newGame
  });
});

exports.deleteGame = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const game = await Game.deleteOne({ _id: id });
  if (!game) {
    return next(new AppError("Jogo não encontrado", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Jogo deletado com sucesso" });
});

const getImagesPath = images => {
  return images.map(image => image.path);
};
