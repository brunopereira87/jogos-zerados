const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeature = require("../utils/apiFeature");
const { Model } = require("mongoose");

exports.deleteOne = (Model, modelName) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const doc = await Model.findByIdAndDelete({ _id: id });
    if (!doc) {
      return next(new AppError(`${modelName} inexistente`, 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};

exports.getOne = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findOne({ _id: id });

    if (!doc) {
      return next(new AppError(`${modelName} inexistente`, 404));
    }
    const response = {
      status: "success",
    };

    response[modelName] = doc;
    //SEND RESPONSE
    res.status(200).json(response);
  });
exports.getOneBySlug = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    const slug = req.params.slug;
    const doc = await Model.findOne({ slug: slug });

    if (!doc) {
      return next(new AppError(`${modelName} inexistente`, 404));
    }
    const response = {
      status: "success",
    };

    response[modelName] = doc;
    //SEND RESPONSE
    res.status(200).json(response);
  });
exports.getAll = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    const feature = new APIFeature(Model.find().populate(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //EXECUTE QUERY
    const docs = await feature.query;
    const response = {
      status: "success",
      results: docs.length,
    };

    response[modelName] = docs;
    //SEND RESPONSE
    res.status(200).json(response);
  });

exports.updateOne = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    req.id = req.params.id;
    console.log('body:', req.body)
    const doc = await Model.findOneAndUpdate({ _id: req.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`${modelName} inexistente`, 404));
    }

    // const data = {};
    // data[modelName] = doc;
    // res.status(200).json({
    //   status: "success",
    //   data,
    // });
    next();
  });
