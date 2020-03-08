const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const plataformSchema = Schema({
  name: {
    type: String,
    required: "O nome da plataforma é obrigatório",
    unique: [true, "A plataforma já existe"]
  },
  company: {
    type: String,
    required: "O nome da empresa da plataforma é obrigatório"
  },
  slug: {
    type: String,
    required: "O slug da plataforma é obrigatório",
    unique: [true, "A plataforma já existe"]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  release_date: Date,
  logo: String
});

plataformSchema.pre("findOneAndUpdate", async function(next) {
  const plataformToUpdate = await this.model.findOne(this.getQuery());

  plataformToUpdate.slug = slugify(plataformToUpdate.name, { lower: true });
  this.findOneAndUpdate(
    { _id: plataformToUpdate._id },
    { slug: plataformToUpdate.slug }
  );
  next();
});
module.exports = mongoose.model("plataforms", plataformSchema);
