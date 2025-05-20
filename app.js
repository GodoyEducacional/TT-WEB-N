const express = require("express");
const mongoose = require("mongoose");
const { dbUser, dbPassword, port } = require("./config/env");
const errorHandler = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Cria uma instância do Express
const app = express();

// Configura o express para entender req. em Json
app.use(express.json());

// Rota aberta
app.get("/", (requisicao, resposta) => {
  resposta.status(200).send({ msg: "Bem vindo a API!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

// Inicia o servidor na porta 3000 e conecta ao DB
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.h93mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`
  )
  .then(() => {
    console.log("Conectado ao MongoDB");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
    process.exit(1);
  });
