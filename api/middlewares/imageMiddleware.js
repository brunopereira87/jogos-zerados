const multer = require("multer");
const image_filters = ["image/jpeg", "image/jpg", "image/png"];

const multer_options = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./api/uploads/images");
    },
    filename: (req, file, cb) => {
      cb(null, "teste_create" + Date.now() + file.originalname);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, next) => {
    if (image_filters.includes(file.mimetype)) {
      next(null, true);
    } else {
      next({ message: "Arquivo não suportado" }, false);
    }
  }
};

exports.upload_single = multer(multer_options).single("photo");
exports.upload_multiple = multer(multer_options).array("images");
exports.upload = multer(multer_options);
