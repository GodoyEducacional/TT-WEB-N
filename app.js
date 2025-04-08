require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Biblioteca para criptografar senhas
const jwt = require("jsonwebtoken"); // Biblioteca para criar e validar Token JWT

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

// Rota Privada
app.get("/user/:id", checktoken, async (req, res) => {
  const id = req.params.id;

  // Busca se o usuário existe
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(200).json({ msg: "Usuário não encontrado!" });
  }

  // Retorna o usuário encontrado
  res.status(200).json({ user });
});

// Midlleware (Checagem de Token)
function checktoken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso Negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O token é inválido!" });
  }
}

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

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validações
  if (!email) {
    return res.status(422).json({ msg: "O E-mail é obrigatório" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }

  // Busca se o usuario existe
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // Verifica se a senha é igual
  const checkPassword = await bcrypt.compare(password, user.password);

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada", token });
  } catch (error) {
    res.status(500).json({ msg: error });
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
