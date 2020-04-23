const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gamesSchema = Schema({
  name: {
    type: String,
    required: "O nome do jogo é obrigatório"
  },
  plataform: {
    type: Schema.Types.ObjectId,
    ref: "plataforms",
    required: "Selecione a plataforma para o jogo"
  },
  slug: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  developer: String,
  publisher: String,
  metacritic: Number,
  userscore: { type: Number, default: 0 },
  styles: [String],
  release_date: Date,
  artbox: String,
  screenshots: [String],
  videos: [String]
});

gamesSchema.pre(/^find/, function(next) {
  this.populate({
    path: "plataform",
    select: "name"
  });

  next();
});
module.exports = mongoose.model("games", gamesSchema);
