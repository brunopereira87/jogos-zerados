const User = require("../models/User");
const UserGame = require("../models/UserGame");
const Game = require('../models/Game');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const filterObj = (obj, ...allowFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Criar um erro se o usuário inserir dados sobre senha
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Essa rota não é para atualizar senhas. Por favor, utilize /updateMyPassword",
        400
      )
    );
  }
  //2) Filtrar os campos permitidos para atualizar
  const filterBody = filterObj(req.body, "name", "email");

  //3) Atualizar o usuário

  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUserGames = catchAsync(async (req, res, next) => {
  console.log('get user games')
  const games = await UserGame.find({ user: req.user.id });

  console.log('Games:', games)
  if (!games) {
    return next(new AppError('Nenhum jogo foi encontrado', 404))
  }
  res.status(200).json({
    status: "success",
    games,
  });

  next();
});

exports.addGame = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.game_id);

  if (!game) {
    return next(new AppError('Game não encontrado', 404))
  }

  const newUserGame = await UserGame.create({
    user: req.user._id,
    game: game._id
  })
  res.status(201).json({
    status: "success",
    game: newUserGame
  })

})
exports.changeReview = catchAsync(async (req, res, next) => {

})
exports.removeGame = catchAsync(async (req, res, next) => {

})