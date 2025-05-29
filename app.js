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

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.h93mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`
    );
    console.log("Conectou ao banco (MongoDB");

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB", err);
    process.exit(1);
  }
};

// Inicia o servidor apenas se NÃO estiver em ambiente de teste
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
