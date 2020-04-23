const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserGameSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, "O id do usuário deve ser fornecido"],
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "games",
    required: [true, "O id do jogo deve ser fornecido"],
  },
  userScore: Number,
  userReview: String,
  playStatus: {
    type: String,
    enum: ["Não Iniciado", "Inicio", "Parado", "Finalizado"],
    default: "Não Iniciado",
  },
});

UserGameSchema.pre(/^find/, function(next) {
  this.populate({
    path: "game",
    select: "name photo plataform",
  });
});
module.exports = mongoose.model("userGames", UserGameSchema);
