// Importa o app configurado (rotas e middlewares)
const app = require('./app');

// Importa a conexão Sequelize já configurada
const sequelize = require('./config/database');

// Define a porta padrão ou a porta do ambiente
const PORT = process.env.PORT || 3000;

/**
 * Função assíncrona responsável por iniciar o servidor:
 * - Testa a conexão com o banco de dados.
 * - Inicia o servidor Express se a conexão for bem-sucedida.
 */
async function startServer() {
  console.log("🔥 Iniciando servidor...");

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('⚠️ Database connection failed:', error.message);
  }

  console.log("👉 Tentando subir servidor...");

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

async function startServer() {
  console.log("🔥 Iniciando servidor...");

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    await sequelize.sync({ alter: true });
    console.log('📦 Database synchronized!');
  } catch (error) {
    console.error('⚠️ Database connection failed:', error.message);
  }

  console.log("👉 Tentando subir servidor...");

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

startServer();