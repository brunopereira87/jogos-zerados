const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gamesSchema = Schema({
  name: {
    type: String,
    required: "O nome do jogo é obrigatório"
  },
  plataform: {
    type: Schema.Types.ObjectId,
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

module.exports = mongoose.model("games", gamesSchema);
