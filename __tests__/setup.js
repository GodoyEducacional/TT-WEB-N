// Importa o Mongoose para conectar ao MongoDB
const mongoose = require("mongoose");

// Importa para criar um servidor em Memória
const { MongoMemoryServer } = require("mongodb-memory-server");

// Variavel irá armazenar o servidor em memória (Instancia)
let mongoServer;

// Configuração global
beforeAll(async () => {
  // Desconectar qualquer conexão
  await mongoose.disconnect();

  // Cria a instancia do MongoDB Memoria
  mongoServer = await MongoMemoryServer.create();

  // Obter a URI de conexão do servidor criado
  const mongoUri = mongoServer.getUri();

  // Configurar opções de conexão
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Conecta o Mongoose ao banco de dados em Memoria
  await mongoose.connect(mongoUri, mongooseOpts);
});

// Limpeza após cada teste
afterEach(async () => {
  // Acessa todas as coleções existentes no DB
  const collections = mongoose.connection.collections;

  // Para cada coleção encontrada ->
  for (const key in collections) {
    // Remove todos os documentos da coleção
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Limpeza após todos os testes
afterAll(async () => {
  // Encerra a conexão do Mongoose com o DB
  await mongoose.disconnect();
  // Para o servidor MongoDB em memória (Libera recurso)
  await mongoServer.stop();
});
