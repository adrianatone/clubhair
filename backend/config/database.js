// Importa o Sequelize (ORM para integração com bancos de dados SQL)
const { Sequelize } = require('sequelize');
// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Criação da instância Sequelize com configurações vindas do .env
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco de dados
  process.env.DB_USER, // Usuário do banco
  process.env.DB_PASS, // Senha do banco
  {
    host: process.env.DB_HOST,    // Endereço do servidor do banco (localhost ou IP externo)
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',             // Define o tipo do banco (MySQL)
    logging: false                // Desativa logs SQL para manter o terminal limpo
  }
);

// Exporta a conexão para ser utilizada em toda a aplicação
module.exports = sequelize;
