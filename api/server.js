const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const app = require("./app");
console.log(process.env.PORT);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Conectado ao banco de dados com sucesso"))
  .catch(err => console.log("Erro ao conectar com o banco de dados:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
