const express = require("express");
//const passport = require('passport')
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const games = require("./routes/games");
const plataforms = require("./routes/plataforms");
const users = require("./routes/users");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/ErrorController");
const app = express();
//Middlewares

//Set rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Número máximo de requisições permitidas para este IP, atingido. Tente novamente em uma hora!"
});

app.use("/api", limiter);

//Set http headers
app.use(helmet());
//Body Parser
app.use(express.json());
app.use(cors());

//Data sanitization noSQL Injection
app.use(mongoSanitize());
//Data sanitization XSS atack
app.use(xss());
//Prevent http parameter polluiton
app.use(
  hpp({
    whitelist: ["userscore", "metacritic", "release_date"]
  })
);

app.use(express.urlencoded({ extended: true }));
//Static files
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname + "/uploads")));

//Routes
app.use("/api/games", games);
app.use("/api/plataforms", plataforms);
app.use("/api/users", users);

app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `Não foi possível encontrar ${req.originalUrl} neste servidor`
  //   });

  const error = new AppError(
    `Não foi possível encontrar ${req.originalUrl} neste servidor`,
    404
  );

  next(error);
});

app.use(globalErrorHandler);
module.exports = app;

// getPagination(totalpages) {
//   this.totalpages = totalpages;

//   let nums = range(totalpages)
//   let init = this.actualPage > 5 ? this.actualPage - 4 : 1;
//   let fim = this.actualPage + 5 < totalpages ? this.actualPage + 5 : totalpages;
//   console.log('Range:', init, fim)
//   console.log(nums.slice(init, fim))
//   return this.pagination = nums.slice(init, fim)
// }