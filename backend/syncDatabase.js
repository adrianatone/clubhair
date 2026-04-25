const sequelize = require('./config/database');
const User = require('./models/User');
const Barbershop = require('./models/Barbershop');
const Service = require('./models/Service');
const Schedule = require('./models/Schedule');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
