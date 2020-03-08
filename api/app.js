const express = require("express");
//const passport = require('passport')
const cors = require("cors");
const path = require("path");
const games = require("./routes/games");
const plataforms = require("./routes/plataforms");
const AppError = require("./utils/AppError");
const app = express();
//Middlewares
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname + "/uploads")));

//Routes
app.use("/api/games", games);
app.use("/api/plataforms", plataforms);

app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     success: false,
  //     message: `Não foi possível encontrar ${req.originalUrl} neste servidor`
  //   });

  const error = new AppError(
    `Não foi possível encontrar ${req.originalUrl} neste servidor`,
    404
  );

  next(error);
});

app.use((err, req, res, next) => {
  err.success = err.success || false;
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: err.success,
    message: err.message
  });
});
module.exports = app;
