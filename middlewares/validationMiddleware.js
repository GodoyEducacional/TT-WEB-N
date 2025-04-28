/**
 * Função que valida um request com base em um schema.
 * @param {Object} schema - O schema de validação
 */

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        msg: "Erro de validação!",
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

module.exports = validateRequest;
