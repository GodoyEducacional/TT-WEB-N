const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usuarioModel");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

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

    await user.save(); // Salva o usuario no banco de dados

    res.status(201).json({ msg: "Usuario criado com sucesso!" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ msg: "Senha incorreta" });
    }

    const secret = process.env.secret;
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

    res.status(200).json({
      msg: "Autenticação realiazada com sucesso",
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};
