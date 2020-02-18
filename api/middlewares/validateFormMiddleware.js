exports.validate = (req, res, next) => {
  console.log("Body:", req.files);
  if (!req.body.name) {
    return res.status(406).json({
      message: "Dados incompletos"
    });
  }

  next();
};
