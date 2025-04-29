const erroHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.isJoi) {
    return res.status(400).json({
      msg: "Erro na validação!",
      errors: err.details.map((detail) => detail.message),
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      msg: "Erro na validação",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.code === 1100) {
    return res.status(422).json({
      msg: "Email já cadastrado!",
    });
  }

  return res.status(500).json({
    msg: "Erro interno do servidor",
  });
};

module.exports = erroHandler;
