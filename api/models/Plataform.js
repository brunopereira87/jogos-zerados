const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plataformSchema = Schema({
  name: {
    type: String,
    required: "O nome da plataforma é obrigatório"
  },
  company: {
    type: String,
    required: "O nome da empresa da plataforma é obrigatório"
  },
  slug: {
    type: String,
    required: "O slug da plataforma é obrigatório"
  },
  release_date: Date,
  logo: String
});

module.exports = mongoose.model("plataforms", plataformSchema);
