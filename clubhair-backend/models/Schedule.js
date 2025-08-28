// Importa os tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a configuração de conexão com o banco de dados
const sequelize = require('../config/database');

// Importa os modelos relacionados
const User = require('./User');           // Cliente que agenda
const Barbershop = require('./Barbershop'); // Barbearia que recebe
const Service = require('./Service');     // Serviço que será agendado

// Define o modelo Schedule que representa um agendamento
const Schedule = sequelize.define('Schedule', {
  // Data do agendamento (ex: 2025-05-01)
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false // Campo obrigatório
  },
  // Hora do agendamento (ex: 14:30:00)
  time: {
    type: DataTypes.TIME,
    allowNull: false // Campo obrigatório
  },
  // Status do agendamento (pendente, confirmado ou cancelado)
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'canceled', 'completed'),
    defaultValue: 'pending'
  },
  // ID do cliente que realizou o agendamento (chave estrangeira)
  clientId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Tabela Users
      key: 'id'
    }
  },
  // ID da barbearia onde o serviço será prestado (chave estrangeira)
  barbershopId: {
    type: DataTypes.INTEGER,
    references: {
      model: Barbershop, // Tabela Barbershops
      key: 'id'
    }
  },
  // ID do serviço escolhido no momento do agendamento (chave estrangeira)
  serviceId: {
    type: DataTypes.INTEGER,
    references: {
      model: Service, // Tabela Services
      key: 'id'
    }
  }
}, {
  tableName: 'schedules',  // Nome da tabela no banco de dados
  timestamps: true         // Cria automaticamente createdAt e updatedAt
});

// Relações: um usuário (cliente) pode ter vários agendamentos
User.hasMany(Schedule, { foreignKey: 'clientId' });

// Relações: uma barbearia pode ter vários agendamentos
Barbershop.hasMany(Schedule, { foreignKey: 'barbershopId' });

// Relações: um serviço pode estar em vários agendamentos
Service.hasMany(Schedule, { foreignKey: 'serviceId' });

// Ligações inversas para facilitar consulta dos dados
Schedule.belongsTo(User, { foreignKey: 'clientId' });
Schedule.belongsTo(Barbershop, { foreignKey: 'barbershopId' });
Schedule.belongsTo(Service, { foreignKey: 'serviceId' });

// Exporta o modelo para uso nas rotas e controllers
module.exports = Schedule;
