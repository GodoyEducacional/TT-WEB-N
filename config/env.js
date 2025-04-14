// Carrega as variaveis de ambiente (.ENV)
require("dotenv").config();

// Lista das variaveis obrigatórias
const requireEnvVars = ["DB_USER", "DB_PASS", "SECRET"];

// Filtra as variaveis ausentes
const missingEnvVars = requireEnvVars.filter((envVar) => !process.env[envVar]);

// Se houver variaveis ausentes, exibe erro e encerra o processo
if (missingEnvVars.length > 0) {
  console.error(
    `Erro: Variáveis de amb. obrigatórias: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Exporta as variáveis de ambiente para o uso em outros arquivos
module.exports = {
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  secret: process.env.SECRET,
  port: process.env.PORT || 3000,
};
