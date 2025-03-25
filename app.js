require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Importando o modelo de Usuario
const User = require("./models/usuarioModel");

// Cria uma instância do Express
const app = express();

// Configura o express para entender req. em Json
app.use(express.json());

app.get("/", (requisicao, resposta) => {
  resposta.status(200).send(carro2025);
});

app.get("/:sigla", (req, res) => {
  const siglaInformada = req.params.sigla.toUpperCase(); // Obtém a sigla
  const carro = carro2025.find(
    (infoCarro) => infoCarro.sigla === siglaInformada
  ); // Busca o carro pela sigla
  if (!carro) {
    // ! Vazio = NOT
    // Se o carro não for encontrado, retorna 404.
    res.status(404).send("Não existe um carro com essa sigla!");
    return; // Para a função!
  }
  res.status(200).send(carro); // Retorna o carro encontrado
});

// Credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Inicia o servidor na porta 3000 e conecta ao DB
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.h93mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco e o servidor na porta 3000");
  })
  .catch((err) => console.log(err));
