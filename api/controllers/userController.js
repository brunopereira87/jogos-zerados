const User = require("../models/User");
const UserGame = require("../models/UserGame");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const filterObj = (obj, ...allowFields) => {
  const newObj = {};

  console.log(allowFields);
  console.log(obj);
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
  const games = await UserGame.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    games,
  });
});
