const Plataform = require("../models/Plataform");
const slugify = require("slugify");
const { convertDate } = require("../helpers");
const APIFeature = require("../utils/APIFeature");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
exports.createPlataform = catchAsync(async (req, res, next) => {
  const slug = slugify(req.body.name, { lower: true });
  const plataform = await Plataform.findOne({ slug: slug });

  // if (plataform) {
  //   return res.status(409).json({
  //     status: "fail",
  //     message: "A plataforma já existe"
  //   });
  // }
  if (plataform) {
    return next(new AppError("A plataforma já existe", 409));
  }
  //req.body.slug = slug;
  req.body.release_date = req.body.release_date
    ? convertDate(req.body.release_date)
    : null;
  req.body.logo = req.file
    ? req.file.path
    : "api\\uploads\\images\\joystick_logo.png";

  const new_plataform = await Plataform.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Plataforma criada com sucesso",
    plataform: new_plataform
  });
});

exports.getAllPlataforms = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(Plataform.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const plataforms = await feature.query;

  res.status(200).json({
    results: plataforms.length,
    plataforms: plataforms
  });
});

exports.getPlataform = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const plataform = await Plataform.findOne({ slug: slug });

  if (!plataform) {
    return next(new AppError("Plataforma não encontrada", 404));
  }
  res.status(200).json({
    status: "success",
    plataform: plataform
  });
});
exports.getPlataformById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const plataform = await Plataform.findOne({ _id: id });
  console.log("Platagom:", plataform);
  if (!plataform) {
    return next(new AppError("Plataforma não encontrada", 404));
  }
  res.status(200).json({
    status: "success",
    plataform: plataform
  });
});

exports.updatePlataform = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (req.file) {
    req.body.logo = req.file.path;
    console.log(req.body.logo);
  }

  const plataform = await Plataform.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true
  });
  if (!plataform) {
    return next(new AppError("Plataforma não encontrada", 404));
  }
  res.status(200).json({
    message: "Plataforma atualizada com sucesso",
    status: "success",
    plataform
  });
});

exports.deletePlataform = async (req, res, next) => {
  const id = req.params.id;
  const plataform = await Plataform.findByIdAndDelete(id, { new: false });
  if (!plataform) {
    return next(new AppError("Plataforma não encontrada", 404));
  }
  res.status(200).json({
    status: "success",
    plataform,
    message: "Plataforma removida com sucesso"
  });
};
