require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Biblioteca para criptografar senhas

// Importando o modelo de Usuario
const User = require("./models/usuarioModel");

// Cria uma instância do Express
const app = express();

// Configura o express para entender req. em Json
app.use(express.json());

// Rota aberta
app.get("/", (requisicao, resposta) => {
  resposta.status(200).send({ msg: "Bem vindo a API!" });
});

// Post de cadastro de usuário
app.post("/auth/register", async (req, res) => {
  const { nome, email, password, confirmpassword } = req.body;

  // Validações
  if (!nome) {
    return res.status(422).json({ msg: "O nome é obrigatório" });
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }

  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório" });
  }

  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação não conferem" });
  }

  // Busca se existe o usuario no DB
  const userExists = await User.findOne({ email: email });

  // Retorna uma mensagem para usuario de duplicidade
  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro E-mail" });
  }

  // Criar a criptografia da senha
  const salt = await bcrypt.genSalt(12); // Gera um salt para criptografar a senha
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar usuario conforme o Model
  const user = new User({
    nome,
    email,
    password: passwordHash, // Senha criptografada
  });

  try {
    await user.save(); // Salva o usuario no banco de dados

    res.status(201).json({ msg: "Usuario criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: "Erro" });
  }
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
