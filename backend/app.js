// Importa o framework Express
const express = require('express');
// Importa o CORS para permitir requisições de diferentes origens
const cors = require('cors');
// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Inicializa a aplicação Express
const app = express();

// 🔹 Middlewares globais
app.use(cors()); // Permite requisições CORS
app.use(express.json()); // Habilita o uso de JSON no corpo das requisições

// 🔹 Rotas de usuários
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// 🔹 Rotas de barbearias
const barbershopRoutes = require('./routes/barbershopRoutes');
app.use('/barbershops', barbershopRoutes);

// 🔹 Rotas de serviços
const serviceRoutes = require('./routes/serviceRoutes');
app.use('/services', serviceRoutes);

// 🔹 Rotas de agendamentos
const scheduleRoutes = require('./routes/scheduleRoutes');
app.use('/schedules', scheduleRoutes);

// 🔹 Rota simples de teste para garantir que a API está online
app.get('/', (req, res) => {
  res.send('ClubHair API is running!');
});

// Exporta o app configurado para uso no server.js
module.exports = app;
