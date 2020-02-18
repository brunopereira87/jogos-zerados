const express = require("express");
//const passport = require('passport')
const cors = require("cors");
const path = require("path");
const games = require("./routes/games");
const plataforms = require("./routes/plataforms");

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
module.exports = app;
