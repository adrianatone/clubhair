// Importa os tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a configuração de conexão com o banco de dados
const sequelize = require('../config/database');
// Importa o modelo Barbershop para criar a associação de serviços
const Barbershop = require('./Barbershop');

// Define o modelo Service que representa os serviços oferecidos pelas barbearias
const Service = sequelize.define('Service', {
  // Nome do serviço (ex: Corte, Barba, Sobrancelha)
  name: {
    type: DataTypes.STRING,
    allowNull: false // Campo obrigatório
  },
  // Preço do serviço (decimal com 2 casas após a vírgula)
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false // Campo obrigatório
  },
  // Duração estimada do serviço (em minutos)
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false // Campo obrigatório
  },
  // Chave estrangeira que vincula o serviço à barbearia que o oferece
  barbershopId: {
    type: DataTypes.INTEGER,
    references: {
      model: Barbershop, // Tabela de barbearias
      key: 'id'          // Campo id da tabela Barbershop
    }
  }
}, {
  tableName: 'services', // Nome da tabela no banco de dados
  timestamps: true       // Cria automaticamente createdAt e updatedAt
});

// Define o relacionamento: Uma barbearia pode ter vários serviços
Barbershop.hasMany(Service, { foreignKey: 'barbershopId' });

// Define o relacionamento inverso: Um serviço pertence a uma barbearia
Service.belongsTo(Barbershop, { foreignKey: 'barbershopId' });

// Exporta o modelo para ser utilizado nas rotas e regras de negócio
module.exports = Service;
