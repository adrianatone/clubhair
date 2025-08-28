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
  try {
    // Testa se a conexão com o banco foi estabelecida corretamente
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // Inicia o servidor na porta especificada
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    // Em caso de erro, exibe mensagem clara no console
    console.error('❌ Unable to start server:', error);
  }
}

// Chama a função para rodar o servidor
startServer();
