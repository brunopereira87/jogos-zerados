exports.validate = (req, res, next) => {
  if (!req.body.name) {
    return res.status(406).json({
      message: "Dados incompletos"
    });
  }

  next();
};
