// Importa os tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a configuração de conexão com o banco de dados
const sequelize = require('../config/database');
// Importa o modelo User para criar a associação
const User = require('./User');

// Define o modelo Barbershop que representa as barbearias cadastradas no sistema
const Barbershop = sequelize.define('Barbershop', {
  // Nome da barbearia
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Campo obrigatório
    unique: true      // Nome da barbearia deve ser único
  },
  // Telefone de contato da barbearia
  phone: {
    type: DataTypes.STRING,
    allowNull: false // Campo obrigatório
  },
  // Endereço completo da barbearia
  address: {
    type: DataTypes.STRING,
    allowNull: false // Campo obrigatório
  },
  // ID do usuário responsável pela barbearia (chave estrangeira)
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,   // Referencia o modelo User
      key: 'id'      // Campo id da tabela User
    }
  }
}, {
  tableName: 'barbershops', // Nome da tabela no banco de dados
  timestamps: true          // Ativa os campos createdAt e updatedAt automaticamente
});

// Relacionamento: Um User possui uma Barbershop
User.hasOne(Barbershop, { foreignKey: 'userId' });

// Relacionamento inverso: Cada Barbershop pertence a um User
Barbershop.belongsTo(User, { foreignKey: 'userId' });

// Exporta o modelo para ser usado em rotas e operações do sistema
module.exports = Barbershop;
