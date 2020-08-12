const Plataform = require('../models/Plataform');
const slugify = require('slugify');
const { convertDate } = require('../helpers');
const APIFeature = require('../utils/APIFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'O arquivo não é uma imagem! Por favor, insira somente imagens',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizePlataformLogo = catchAsync(async (req, res, next) => {

  console.log('file:', req.file)
  if (!req.file) return next();
  const path = `/images/plataforms/${req.id}/logo`;
  req.body.logo = `${path}/plataform-${Date.now()}.jpeg`;
  fs.mkdirSync('./api/uploads' + path, { recursive: true });

  await sharp(req.file.buffer)
    .resize(500, 500,
      {
        fit: 'contain',
        background: '#fff'
      }
    )
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./api/uploads${req.body.logo}`);

  next();
});
exports.uploadPlataformLogo = upload.single('logo');

exports.createPlataform = catchAsync(async (req, res, next) => {
  const slug = slugify(req.body.name, { lower: true });
  const plataform = await Plataform.findOne({ slug: slug });

  if (plataform) {
    return next(new AppError('A plataforma já existe', 409));
  }

  req.body.release_date = req.body.release_date
    ? convertDate(req.body.release_date)
    : null;

  const new_plataform = await Plataform.create(req.body);
  req.id = new_plataform._id;

  next();
});

exports.updatePlataformLogo = catchAsync(async (req, res, next) => {
  const plataform_id = req.params.id ? req.params.id : req.id;

  const plataform = await Plataform.findById(plataform_id);
  if (!plataform) return new AppError('Plataforma não encontrada', 404);

  const logo = req.body.logo ? req.body.logo : plataform.logo;
  console.log('Logo:', logo)
  console.log('Plat Logo:', plataform.logo)
  const updatedPlataform = await Plataform.findByIdAndUpdate(
    plataform,
    { logo },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      plataform: plataform,
    },
  });
});

exports.getAllPlataforms = factory.getAll(Plataform, 'plataformas')

// exports.getPlataform = catchAsync(async (req, res, next) => {
//   const slug = req.params.slug;
//   const plataform = await Plataform.findOne({ slug: slug });

//   if (!plataform) {
//     return next(new AppError('Plataforma não encontrada', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     plataform: plataform,
//   });
// });
exports.getPlataform = factory.getOneBySlug(Plataform, 'plataforma')
exports.getPlataformById = factory.getOne(Plataform, 'plataforma')

exports.updatePlataform = factory.updateOne(Plataform, 'plataforma')
// exports.updatePlataform = catchAsync(async (req, res, next) => {
//   req.id = req.params.id;

//   const plataform = await Plataform.findOneAndUpdate({ _id: req.id }, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!plataform) {
//     return next(new AppError('Plataforma não encontrada', 404));
//   }
//   next();
//   // res.status(200).json({
//   //   message: 'Plataforma atualizada com sucesso',
//   //   status: 'success',
//   //   plataform,
//   // });
// });

// exports.deletePlataform = async (req, res, next) => {
//   const id = req.params.id;
//   const plataform = await Plataform.findByIdAndDelete(id, { new: false });
//   if (!plataform) {
//     return next(new AppError('Plataforma não encontrada', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     plataform,
//     message: 'Plataforma removida com sucesso',
//   });
// };
exports.deletePlataform = factory.deleteOne(Plataform, 'plataforma')