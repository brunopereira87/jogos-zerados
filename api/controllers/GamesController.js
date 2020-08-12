const Game = require('../models/Game');
const factory = require('./handlerFactory');
const slugify = require('slugify');
const APIFeature = require('../utils/APIFeature');
const { convertDate, stringToArray } = require('../helpers');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const fs = require('fs')
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
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.uploadGameImages = upload.fields([
  { name: 'artbox', maxCount: 1 },
  { name: 'screenshots', maxCount: 4 },
]);

exports.resizeGameImages = catchAsync(async (req, res, next) => {
  //1) Logo
  //console.log('file:', req.files)
  if (req.files.artbox) {
    const logo_path = `/images/games/${req.id}/artbox`
    req.body.artbox = `${logo_path}/game-artbox-${Date.now()}.jpeg`;
    fs.mkdirSync('./api/uploads' + logo_path, { recursive: true });
    await sharp(req.files.artbox[0].buffer)
      .resize(null, 500, {
        fit: 'contain',
        background: '#fff'
      })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./api/uploads${req.body.artbox}`);
  }

  //2) Screenshots

  if (req.files.screenshots && req.files.screenshots.length > 0) {
    const screens_path = `/api/uploads/images/games/${req.id}/screenshots`
    fs.mkdirSync(screens_path, { recursive: true });
    req.body.screenshots = [];
    await Promise.all(
      req.files.screenshots.map(async (file, i) => {
        const filename = `game-image-${Date.now()}-${i}.jpeg`;

        await sharp(file.buffer)
          .resize(1280, 720)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`/api/uploads/images/games/${req.id}/screenshots/${filename}`);

        req.body.screenshots.push(filename);
      })
    );
  }

  next();
});

exports.updateGameImages = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.id);
  if (!game) return new AppError('Jogo não encontrado', 404);

  const screenshots = req.body.screenshots ? req.body.screenshots : [];
  const artbox = game.artbox ? game.artbox : '/api/uploads/images/joystick.png';
  const updateGameBody = {
    artbox: req.body.artbox ? req.body.artbox : artbox,
    screenshots: [...game.screenshots, ...screenshots],
  };

  const updatedGame = await Game.findByIdAndUpdate(
    req.id,
    updateGameBody,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      game: updatedGame,
    },
  });
});
exports.getAllGames = factory.getAll(Game, 'games');

exports.getGame = factory.getOne(Game, 'game');
exports.getGameBySlug = factory.getOneBySlug(Game, 'game');
exports.createGame = catchAsync(async (req, res, next) => {
  const slug = slugify(req.body.name, { lower: true });
  const result = await Game.findOne(
    { slug: slug },
    { plataform: req.body.plataform }
  );

  if (result) {
    return next(new AppError('Jogo já cadastrado', 409));
  }

  req.body.slug = slug;
  req.body.release_date = req.body.release_date
    ? convertDate(req.body.release_date)
    : null;

  if (req.body.styles) req.body.styles = stringToArray(req.body.styles, ',');

  const newGame = await Game.create(req.body);
  req.id = newGame._id;

  next();
});

exports.updateGame = factory.updateOne(Game, 'game')
exports.deleteGame = factory.deleteOne(Game, 'game');

const getImagesPath = (images) => {
  return images.map((image) => image.path);
};
