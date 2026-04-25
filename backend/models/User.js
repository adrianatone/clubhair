// Importa os tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a conexão com o banco de dados configurada anteriormente
const sequelize = require('../config/database');

// Define o modelo User, que representa os usuários do sistema
const User = sequelize.define('User', {
  // Nome do usuário (cliente ou responsável pela barbearia)
  name: {
    type: DataTypes.STRING,
    allowNull: false // Campo obrigatório
  },
  // Email do usuário, usado também para login
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Campo obrigatório
    unique: true      // Não permite e-mails duplicados
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9]{10,11}$/
    }
  },
  // Senha de acesso (armazenada sem criptografia neste projeto)
  password: {
    type: DataTypes.STRING,
    allowNull: false // Campo obrigatório
  },
  // Tipo do usuário: pode ser 'client' ou 'barbershop'
  type: {
    type: DataTypes.ENUM('client', 'barbershop'),
    allowNull: false // Campo obrigatório
  },
});

// Exporta o modelo User para ser utilizado nas rotas e lógicas do sistema
module.exports = User;
