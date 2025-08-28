ClubHair - Sistema de Agendamento para Barbearias
💈 Descrição Geral
ClubHair é um sistema de agendamento online destinado a barbearias.
O projeto foi desenvolvido utilizando Node.js, Express, Sequelize e MySQL (XAMPP) como banco de dados. O front-end é feito com HTML, CSS e JavaScript para apresentação e integração com a API.
O objetivo é facilitar a gestão de horários, permitindo cadastro de usuários, barbearias, serviços e agendamentos, além de login, cancelamento e filtros.

🗂️ Estrutura de Pastas
clubhair-backend/
├── config/
│   └── database.js      # Configuração da conexão com o banco
├── models/              # Models Sequelize (User, Barbershop, Service, Schedule)
├── routes/              # Rotas da API (users, barbershops, services, schedules)
├── app.js               # Configuração principal do Express
├── server.js            # Inicializa o servidor e conecta ao banco
├── testConnection.js    # Teste de conexão com o banco
├── syncDatabase.js      # Sincroniza models com o banco de dados
├── .env                 # Configuração de variáveis ambiente
├── .gitignore           # Arquivo para ignorar dados sensíveis
└── README.md            # Documentação do projeto

⚙️ Configuração do Banco de Dados (XAMPP)
Inicie MySQL e Apache pelo XAMPP.

Acesse: http://localhost/phpmyadmin.

Clique em Nova, crie o banco clubhair_db com collation utf8_general_ci.

Crie o arquivo .env:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=clubhair_db

🔌 Testando a Conexão com o Banco
Arquivo: testConnection.js

const sequelize = require('./config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection();

No terminal:
**\ node testConnection.js /**
✅ Se aparecer:
>Connection has been established successfully.
A conexão foi feita!

💾 Sincronizando Models com o Banco
Arquivo: syncDatabase.js

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

No terminal:
**\ node syncDatabase.js /**
✅ Se aparecer:
>All models were synchronized successfully.
As tabelas foram criadas com sucesso!

🖥️ Iniciando o Servidor
**\ node server.js /**
Acesse no navegador: http://localhost:3000/
Se tudo estiver certo, aparecerá:
>ClubHair API is running!

🧑‍💼 Rotas da API (Endpoints)
🌐 Base URL: http://localhost:3000

📌 Usuários
1️⃣ Criar Usuário
POST /users
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "type": "client"
}
(type: client ou barbershop)

2️⃣ Login de Usuário
POST /users/login
{
  "email": "john@example.com",
  "password": "123456"
}

✂️ Barbearias
3️⃣ Listar Barbearias
GET /barbershops
(sem body)

💇‍♂️ Serviços
4️⃣ Criar Serviço
POST /services
{
  "name": "Corte de Cabelo Masculino",
  "price": 30.00,
  "duration": 45,
  "barbershopId": 1
}

📅 Agendamentos
5️⃣ Criar Agendamento
POST /schedules
{
  "date": "2025-04-20",
  "time": "14:00:00",
  "clientId": 1,
  "barbershopId": 1,
  "serviceId": 1
}

6️⃣ Listar Todos os Agendamentos
GET /schedules
(sem body)

7️⃣ Cancelar Agendamento
PUT /schedules/{id}/cancel
Exemplo: http://localhost:3000/schedules/1/cancel

8️⃣ Filtrar Agendamentos
GET /schedules/filter

Exemplos:
Por status: http://localhost:3000/schedules/filter?status=pending
Por cliente: http://localhost:3000/schedules/filter?clientId=1
Por barbearia e status: http://localhost:3000/schedules/filter?barbershopId=1&status=canceled

🧪 Testando com Postman
Abra o Postman.

Crie uma nova requisição.

Escolha o método (GET, POST, PUT).

Para POST ou PUT:
vá em Body > raw > JSON e cole os exemplos desta documentação.

Clique em Send e observe a resposta.

Repita para todos os endpoints!

🔐 Observações de Segurança
As senhas atualmente são armazenadas em texto simples.

Recomenda-se uso de bcrypt para produção.

O código para criptografia está comentado no arquivo:
models/User.js e routes/userRoutes.js.