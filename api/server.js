const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });
process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! SHUTING DOWN...");
  process.exit(1);
});
const app = require("./app");

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
const server = app.listen(PORT, () =>
  console.log("Servidor rodando na porta " + PORT)
);

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! SHUTING DOWN...");
  server.close(() => {
    process.exit(1);
  });
});
