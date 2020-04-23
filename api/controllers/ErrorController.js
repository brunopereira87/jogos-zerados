const AppError = require("../utils/AppError");
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error("ERROR:", err);
    res.status(500).json({
      message: "Erro desconhecido"
    });
  }
};

const handlerCastErrorDB = err => {
  const message = `${err.path} inválido: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  console.log("Validation Errors Found");
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Erros de validação encontrados: ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsErrorDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Valor de campo único,'${value}' duplicado. Por favor, insira outro valor!`;
  return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handlerCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
