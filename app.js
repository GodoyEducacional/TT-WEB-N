// Importa o Framework express
import express from "express";

// Import da tabela.js
import carro2025 from "./tabela.js";

// Cria uma instância do Express
const app = express();

// Configura o express para entender req. em Json
app.use(express.json());

app.get("/", (requisicao, resposta) => {
  resposta.status(200).send(carro2025);
});

// Inicia o servidor na porta 3000
app.listen(3000, () => console.log("Servidor rodando!"));
