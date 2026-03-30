# 💈 ClubHair

Sistema web para gerenciamento de barbearias, permitindo o cadastro de clientes, profissionais e agendamento de serviços de forma prática e organizada.

---

## 📌 Sobre o Projeto

O **ClubHair** é uma aplicação desenvolvida com o objetivo de facilitar o gerenciamento de atendimentos em barbearias, oferecendo controle de agenda, cadastro de usuários e organização dos serviços prestados.

👉 O projeto foi desenvolvido com foco em uso local, para facilitar testes e futuras expansões.

---

## ✨ Funcionalidades Principais

### Para Clientes:
- ✅ **Cadastro e autenticação** de conta pessoal
- 🔍 **Visualização de barbearias** cadastradas no sistema
- 📋 **Listagem de serviços** oferecidos por cada barbearia
- 📅 **Agendamento de serviços** com data e horário
- 👁️ **Acompanhamento do status** dos agendamentos (pendente, confirmado, concluído, cancelado)
- ❌ **Cancelamento de agendamentos** a qualquer momento
- 👤 **Gerenciamento de perfil** (atualização de nome, email, telefone e senha)

### Para Barbearias:
- ✅ **Cadastro em 2 etapas**: criação de usuário + cadastro da barbearia
- 🏪 **Gerenciamento de perfil da barbearia** (nome, endereço, telefone)
- 💼 **Cadastro e gerenciamento de serviços** (nome, preço, duração)
- 📆 **Visualização de todos os agendamentos** recebidos
- ✔️ **Confirmação, conclusão ou cancelamento** de agendamentos
- 🔔 **Dashboard com visão geral** dos agendamentos e status

---

### Recursos Técnicos:
- 🔐 **Autenticação simples** com email e senha
- 🔄 **Relacionamentos entre entidades** (Users, Barbershops, Services, Schedules)
- 🚫 **Validação de conflitos** de horário para evitar dupla marcação
- 📊 **API RESTful** com endpoints bem documentados
- 🔗 **Integridade referencial** com CASCADE e SET NULL
- 🎯 **Validações de entrada** em todos os endpoints
- 📄 **Paginação** em listagens de dados

---

### Back-End

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | 18+ | Ambiente de execução JavaScript server-side |
| **Express** | 5.1.0 | Framework minimalista de rotas e middlewares |
| **Sequelize** | 6.37.7 | ORM para comunicação com banco de dados MySQL |
| **MySQL** | 8.0+ | Banco de dados relacional (via XAMPP) |
| **dotenv** | 16.5.0 | Gerenciamento de variáveis de ambiente |
| **CORS** | 2.8.5 | Middleware para permitir requisições cross-origin |

### Front-End

| Tecnologia | Descrição |
|-----------|-----------|
| **HTML5** | Estruturação semântica das páginas |
| **CSS3** | Estilização responsiva e moderna |
| **JavaScript** | Programação de interações e consumo da API |
| **LocalStorage** | Armazenamento de dados do usuário logado |

### Ferramentas Auxiliares

| Ferramenta | Uso |
|-----------|-----|
| **XAMPP** | Ambiente de desenvolvimento com MySQL Server local |
| **phpMyAdmin** | Interface gráfica para gerenciamento do banco de dados |
| **VSCode** | Editor de código recomendado |
| **Postman** | Testes de rotas HTTP (API) |
| **Nodemon** | Auto-restart do servidor durante desenvolvimento |

---

## ♿ Acessibilidade

O sistema foi desenvolvido com base nas diretrizes de acessibilidade da **WCAG (Web Content Accessibility Guidelines)**, visando garantir inclusão e usabilidade para todos os usuários.

### ✅ Recursos implementados

- Uso de HTML semântico (`header`, `main`, `section`)
- Navegação por teclado (Tab e Enter)
- Labels associadas aos inputs
- Textos alternativos em imagens (`alt`)
- Feedback visual em formulários
- Validação acessível de campos
- Estrutura organizada para leitores de tela

---

### 🎯 Boas práticas adotadas

| Prática | Descrição |
|--------|----------|
| HTML semântico | Facilita leitura por tecnologias assistivas |
| ARIA | Melhora a acessibilidade para leitores de tela |
| Contraste de cores | Garante legibilidade |
| Navegação por teclado | Permite uso sem mouse |
| Feedback visual | Indica erros e ações do usuário |

---

### 👥 Endpoints de Usuários

#### 1. Criar Usuário
```http
POST /users
Content-Type: application/json

Body:
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "type": "client"  // ou "barbershop"
}

Response 201:
{
  "message": "Usuário cadastrado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "type": "client"
  }
}
```

**Validações:**
- Nome: 3-100 caracteres, obrigatório
- Email: formato válido, único no sistema, obrigatório
- Senha: mínimo 6 caracteres, obrigatória
- Tipo: deve ser "client" ou "barbershop"

---

#### 2. Login de Usuário
```http
POST /users/login
Content-Type: application/json

Body:
{
  "email": "joao@email.com",
  "password": "senha123"
}

Response 200:
{
  "message": "Login realizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "type": "client"
  }
}
```

**Possíveis Respostas:**
- 200: Login bem-sucedido
- 404: Usuário não encontrado
- 401: Senha inválida

---

#### 3. Buscar Usuário por ID
```http
GET /users/:id

Response 200:
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11987654321",
  "type": "client",
  "createdAt": "2025-11-30T10:00:00.000Z",
  "updatedAt": "2025-11-30T10:00:00.000Z"
}
```

---

#### 4. Atualizar Usuário
```http
PUT /users/:id
Content-Type: application/json

Body (todos os campos opcionais):
{
  "name": "João Pedro Silva",
  "email": "joaopedro@email.com",
  "phone": "11987654321",
  "password": "novaSenha123"
}

Response 200:
{
  "message": "Usuário atualizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Pedro Silva",
    "email": "joaopedro@email.com",
    "phone": "11987654321",
    "type": "client"
  }
}
```

**Validações:**
- Nome: 3-100 caracteres (se fornecido)
- Email: formato válido, único (se fornecido)
- Telefone: 10-11 dígitos (se fornecido)
- Senha: mínimo 6 caracteres (se fornecida)

---

#### 5. Deletar Usuário
```http
DELETE /users/:id

Response 200:
{
  "message": "Usuário excluído com sucesso!"
}
```

---

### 🏪 Endpoints de Barbearias

#### 1. Criar Barbearia
```http
POST /barbershops
Content-Type: application/json

Body:
{
  "name": "Barbearia Estilo",
  "phone": "11987654321",
  "address": "Rua das Flores, 123 - Centro, São Paulo - SP",
  "userId": 2
}

Response 201:
{
  "id": 1,
  "name": "Barbearia Estilo",
  "phone": "11987654321",
  "address": "Rua das Flores, 123 - Centro, São Paulo - SP",
  "userId": 2,
  "createdAt": "2025-11-30T10:00:00.000Z",
  "updatedAt": "2025-11-30T10:00:00.000Z"
}
```

**Validações:**
- Nome: 3-100 caracteres, único, obrigatório
- Telefone: 10-11 dígitos, obrigatório
- Endereço: 10-200 caracteres, obrigatório
- UserId: deve existir e ser do tipo "barbershop"
- Um usuário pode ter apenas uma barbearia

---

#### 2. Listar Todas as Barbearias (com Paginação)
```http
GET /barbershops?page=1&limit=10

Response 200:
{
  "barbershops": [
    {
      "id": 1,
      "name": "Barbearia Estilo",
      "phone": "11987654321",
      "address": "Rua das Flores, 123",
      "userId": 2,
      "createdAt": "2025-11-30T10:00:00.000Z",
      "updatedAt": "2025-11-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

**Query Parameters:**
- `page`: número da página (padrão: 1)
- `limit`: itens por página (padrão: 10)

---

#### 3. Buscar Barbearia por ID
```http
GET /barbershops/:id

Response 200:
{
  "id": 1,
  "name": "Barbearia Estilo",
  "phone": "11987654321",
  "address": "Rua das Flores, 123",
  "userId": 2,
  "createdAt": "2025-11-30T10:00:00.000Z",
  "updatedAt": "2025-11-30T10:00:00.000Z"
}
```

---

#### 4. Buscar Barbearia por User ID
```http
GET /barbershops/user/:userId

Response 200:
{
  "barbershop": {
    "id": 1,
    "name": "Barbearia Estilo",
    "phone": "11987654321",
    "address": "Rua das Flores, 123",
    "userId": 2,
    "User": {
      "id": 2,
      "name": "Maria Santos",
      "email": "maria@email.com",
      "type": "barbershop"
    }
  }
}
```

---

#### 5. Atualizar Barbearia
```http
PUT /barbershops/:id
Content-Type: application/json

Body (campos opcionais):
{
  "name": "Barbearia Novo Estilo",
  "phone": "11999887766",
  "address": "Av. Paulista, 1000"
}

Response 200:
{
  "message": "Perfil atualizado com sucesso!",
  "barbershop": {
    "id": 1,
    "name": "Barbearia Novo Estilo",
    "phone": "11999887766",
    "address": "Av. Paulista, 1000",
    "userId": 2
  }
}
```

---

#### 6. Deletar Barbearia
```http
DELETE /barbershops/:id?deleteUser=false

Response 200:
{
  "message": "Barbearia excluída com sucesso!"
}
```

**Query Parameters:**
- `deleteUser`: `true` para deletar também o usuário associado (padrão: `false`)

> ⚠️ **Atenção**: Deletar uma barbearia também deleta todos os seus serviços e agendamentos (CASCADE).

---

### 💼 Endpoints de Serviços

#### 1. Criar Serviço
```http
POST /services
Content-Type: application/json

Body:
{
  "name": "Corte Degradê",
  "price": 45.00,
  "duration": 45,
  "barbershopId": 1
}

Response 201:
{
  "id": 1,
  "name": "Corte Degradê",
  "price": 45.00,
  "duration": 45,
  "barbershopId": 1,
  "createdAt": "2025-11-30T10:00:00.000Z",
  "updatedAt": "2025-11-30T10:00:00.000Z"
}
```

**Validações:**
- Nome: 2-100 caracteres, obrigatório
- Preço: número maior que zero, obrigatório
- Duração: 1-480 minutos, obrigatório
- BarbershopId: deve existir, obrigatório

---

#### 2. Listar Serviços (com Filtros e Paginação)
```http
GET /services?barbershopId=1&page=1&limit=10

Response 200:
{
  "services": [
    {
      "id": 1,
      "name": "Corte Degradê",
      "price": 45.00,
      "duration": 45,
      "barbershopId": 1,
      "createdAt": "2025-11-30T10:00:00.000Z",
      "updatedAt": "2025-11-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**Query Parameters:**
- `barbershopId`: filtrar por barbearia (opcional)
- `page`: número da página (padrão: 1)
- `limit`: itens por página (padrão: 10)

---

#### 3. Buscar Serviço por ID
```http
GET /services/:id

Response 200:
{
  "id": 1,
  "name": "Corte Degradê",
  "price": 45.00,
  "duration": 45,
  "barbershopId": 1,
  "createdAt": "2025-11-30T10:00:00.000Z",
  "updatedAt": "2025-11-30T10:00:00.000Z"
}
```

---

#### 4. Atualizar Serviço
```http
PUT /services/:id
Content-Type: application/json

Body (campos opcionais):
{
  "name": "Corte Degradê Premium",
  "price": 55.00,
  "duration": 60
}

Response 200:
{
  "message": "Serviço atualizado com sucesso!",
  "service": {
    "id": 1,
    "name": "Corte Degradê Premium",
    "price": 55.00,
    "duration": 60,
    "barbershopId": 1
  }
}
```

---

#### 5. Deletar Serviço
```http
DELETE /services/:id

Response 200:
{
  "message": "Serviço excluído com sucesso!"
}
```

> ⚠️ **Nota**: Deletar um serviço define `serviceId` como `NULL` nos agendamentos relacionados (SET NULL).

---

### 📅 Endpoints de Agendamentos

#### 1. Criar Agendamento
```http
POST /schedules
Content-Type: application/json

Body:
{
  "date": "2025-12-05",
  "time": "14:30",
  "clientId": 1,
  "barbershopId": 1,
  "serviceId": 1
}

Response 201:
{
  "id": 1,
  "date": "2025-12-05",
  "time": "14:30:00",
  "status": "pending",
  "clientId": 1,
  "barbershopId": 1,
  "serviceId": 1,
  "createdAt": "2025-11-30T10:00:00.000Z",
  "updatedAt": "2025-11-30T10:00:00.000Z"
}
```

**Validações:**
- Data: não pode ser no passado
- Hora: formato HH:MM, não pode ter passado (se for hoje)
- ClientId, BarbershopId, ServiceId: devem existir
- Serviço deve pertencer à barbearia selecionada
- Não pode haver conflito de horário (mesma barbearia, data e hora)
- Cliente não pode ter 2 agendamentos no mesmo horário

**Possíveis Respostas:**
- 201: Agendamento criado com sucesso
- 400: Validações falharam
- 404: Cliente, barbearia ou serviço não encontrado
- 409: Conflito de horário

---

#### 2. Listar Todos os Agendamentos (com Paginação)
```http
GET /schedules?page=1&limit=10

Response 200:
{
  "schedules": [
    {
      "id": 1,
      "date": "2025-12-05",
      "time": "14:30:00",
      "status": "pending",
      "clientId": 1,
      "barbershopId": 1,
      "serviceId": 1,
      "User": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "Barbershop": {
        "id": 1,
        "name": "Barbearia Estilo",
        "address": "Rua das Flores, 123",
        "phone": "11987654321"
      },
      "Service": {
        "id": 1,
        "name": "Corte Degradê",
        "price": 45.00,
        "duration": 45
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### 3. Buscar Agendamentos por Cliente
```http
GET /schedules/client/:clientId

Response 200:
{
  "schedules": [
    {
      "id": 1,
      "date": "2025-12-05",
      "time": "14:30:00",
      "status": "pending",
      "Barbershop": {
        "id": 1,
        "name": "Barbearia Estilo",
        "address": "Rua das Flores, 123",
        "phone": "11987654321"
      },
      "Service": {
        "id": 1,
        "name": "Corte Degradê",
        "price": 45.00,
        "duration": 45
      }
    }
  ]
}
```

---

#### 4. Buscar Agendamentos por Barbearia
```http
GET /schedules/barbershop/:barbershopId

Response 200:
{
  "schedules": [
    {
      "id": 1,
      "date": "2025-12-05",
      "time": "14:30:00",
      "status": "pending",
      "User": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "Service": {
        "id": 1,
        "name": "Corte Degradê",
        "price": 45.00,
        "duration": 45
      }
    }
  ]
}
```

---

#### 5. Filtrar Agendamentos
```http
GET /schedules/filter?status=pending&barbershopId=1

Response 200:
[
  {
    "id": 1,
    "date": "2025-12-05",
    "time": "14:30:00",
    "status": "pending",
    "User": { ... },
    "Barbershop": { ... },
    "Service": { ... }
  }
]
```

**Query Parameters:**
- `status`: `pending`, `confirmed`, `completed`, `canceled`
- `clientId`: ID do cliente
- `barbershopId`: ID da barbearia

---

#### 6. Atualizar Status do Agendamento
```http
PUT /schedules/:id/status
Content-Type: application/json

Body:
{
  "status": "confirmed"
}

Response 200:
{
  "message": "Status atualizado para 'confirmed' com sucesso!",
  "schedule": {
    "id": 1,
    "date": "2025-12-05",
    "time": "14:30:00",
    "status": "confirmed",
    ...
  }
}
```

**Status Válidos:**
- `pending`: Aguardando confirmação da barbearia
- `confirmed`: Confirmado pela barbearia
- `completed`: Serviço concluído
- `canceled`: Cancelado (por cliente ou barbearia)

---

#### 7. Cancelar Agendamento
```http
PUT /schedules/:id/cancel

Response 200:
{
  "message": "Agendamento cancelado com sucesso!",
  "schedule": {
    "id": 1,
    "status": "canceled",
    ...
  }
}
```

---

#### 8. Deletar Agendamento (Hard Delete)
```http
DELETE /schedules/:id

Response 200:
{
  "message": "Agendamento excluído permanentemente!"
}
```

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- ✅ **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- ✅ **XAMPP** (ou MySQL Server) - [Download](https://www.apachefriends.org/)
- ✅ **NPM** ou **Yarn** (gerenciador de pacotes)
- ✅ **Git** (opcional, para clonar o repositório)
- ✅ **Navegador moderno** (Chrome, Firefox, Edge, etc.)

---

## ⚙️ Como Configurar o Projeto Localmente

### 1️⃣ Configure o Banco de Dados

1. Abra o **XAMPP** e inicie os serviços **Apache** e **MySQL**
2. Acesse o **phpMyAdmin** (padrão: `http://localhost/phpmyadmin`)
3. Crie um novo banco de dados com o nome `clubhair_db`
4. Selecione a codificação `utf8_general_ci` ou `utf8mb4_general_ci`

### 2️⃣ Configure as Variáveis de Ambiente

No diretório `backend/`, crie um arquivo `.env` com o seguinte conteúdo:

```env
DB_NAME=clubhair_db
DB_USER=root
DB_PASS=
DB_HOST=localhost
```

> 💡 **Nota**: Se sua instalação do MySQL tiver senha, preencha o campo `DB_PASS` com a senha correta.

### 3️⃣ Instale as Dependências do Back-End

No terminal, navegue até a pasta `backend/` e execute:

```bash
cd backend
npm install
```

Isso instalará todas as dependências necessárias listadas no `package.json`:
- express
- sequelize
- mysql2
- dotenv
- cors
- nodemon (dev)

### 4️⃣ Sincronize o Banco de Dados

Ainda no diretório `backend/`, execute o script de sincronização:

```bash
node syncDatabase.js
```

✅ **Esse comando criará todas as tabelas** no banco de dados baseadas nos models:
- `Users` - Usuários (clientes e barbearias)
- `Barbershops` - Informações das barbearias
- `Services` - Serviços oferecidos pelas barbearias
- `Schedules` - Agendamentos realizados

### 5️⃣ Inicie o Servidor Back-End

No diretório `backend/`, execute:

```bash
node server.js
```

Ou, para desenvolvimento com auto-reload:

```bash
npm run dev
```

Se tudo estiver configurado corretamente, você verá no terminal:

```
✅ Database connected successfully!
🚀 Server is running at: http://localhost:3000
```

Para verificar se a API está funcionando, acesse:
```
http://localhost:3000
```

Você deve ver a mensagem: **"ClubHair API is running!"**

### 6️⃣ Abra o Front-End

Navegue até o diretório `frontend/` e abra o arquivo `index.html` no seu navegador:

```
frontend/index.html
```

Ou utilize uma extensão do VSCode como **Live Server** para servir os arquivos estáticos.

🎉 **Pronto!** O sistema ClubHair está rodando localmente.

### Controle do Sistema:

- 🔧 **Back-End** (API Express) processa todas as requisições
- 🗄️ **MySQL** com Sequelize gerencia os dados
- 🎨 **JavaScript** no Front-End consome a API
- 💾 **LocalStorage** armazena dados do usuário logado

---

## 🗂️ Estrutura de Pastas Comentada

```
clubhair/
│
├── backend/                      # Diretório principal do Back-End
│   ├── config/                   # Configurações do projeto
│   │   └── database.js           # Configuração de conexão com MySQL via Sequelize
│   │
│   ├── models/                   # Models do Sequelize (representam tabelas)
│   │   ├── User.js               # Model de Usuário (client ou barbershop)
│   │   ├── Barbershop.js         # Model de Barbearia (dados da loja)
│   │   ├── Service.js            # Model de Serviço (oferecido pela barbearia)
│   │   └── Schedule.js           # Model de Agendamento (entre cliente e barbearia)
│   │
│   ├── routes/                   # Rotas da API (endpoints REST)
│   │   ├── userRoutes.js         # Rotas de usuários (CRUD + login)
│   │   ├── barbershopRoutes.js   # Rotas de barbearias (CRUD + busca)
│   │   ├── serviceRoutes.js      # Rotas de serviços (CRUD + filtros)
│   │   └── scheduleRoutes.js     # Rotas de agendamentos (CRUD + status)
│   │
│   ├── .env                      # Variáveis de ambiente (DB_NAME, DB_USER, etc.)
│   ├── .gitignore                # Arquivos a serem ignorados pelo Git
│   ├── app.js                    # Configuração principal do Express (middlewares e rotas)
│   ├── server.js                 # Inicialização do servidor HTTP
│   ├── syncDatabase.js           # Script para sincronizar models com o banco
│   ├── testConnection.js         # Script para testar conexão com o banco
│   ├── package.json              # Dependências e scripts NPM
│   └── package-lock.json         # Lock de versões das dependências
│
├── frontend/                     # Diretório principal do Front-End
│   ├── assets/                   # Recursos estáticos (CSS, JS, imagens)
│   │   ├── css/                  # Estilos CSS organizados por funcionalidade
│   │   │   ├── components.css    # Componentes Reutilizáveis (Botões, modal e etc...)
│   │   │   └── global.css        # Arquivo com reset CSS, variáveis globais e estilos base
│   │   │
│   │   ├── js/                   # Scripts JavaScript modulares
│   │   │   ├── api.js            # Funções para consumir a API (fetch)
│   │   │   ├── auth.js           # Funções de autenticação e autorização
│   │   │   ├── utils.js          # Funções utilitárias (formatação, validação)
│   │   │   └── ui.js             # Funções de manipulação da interface
│   │   │
│   │   └── images/               # Imagens do projeto (logo, ícones, etc.)
│   │       └── logo.png          # Logo do ClubHair
│   │
│   ├── pages/                    # Páginas HTML do sistema
│   │   ├── barbershop/           # Fluxo completo da barbearia
│   │   │   ├── barbershop-register.html    # Registro de barbearia
│   │   │   ├── barbershop-login.html       # Login de barbearia
│   │   │   ├── barbershop-dashboard.html   # Dashboard principal
│   │   │   ├── barbershop-profile.html     # Edição de perfil
│   │   │   ├── barbershop-services.html    # Gerenciamento de serviços
│   │   │   └── barbershop-appointments.html # Visualização de agendamentos
│   │   │
│   │   └── client/               # Fluxo completo do cliente
│   │       ├── client-register.html        # Registro de cliente
│   │       ├── client-login.html           # Login de cliente
│   │       ├── client-dashboard.html       # Dashboard principal
│   │       ├── client-profile.html         # Edição de perfil
│   │       ├── client-barbershops.html     # Listagem de barbearias
│   │       ├── client-services.html        # Serviços de uma barbearia
│   │       ├── client-booking.html         # Formulário de agendamento
│   │       └── client-appointments.html    # Meus agendamentos
│   │
│   └── index.html                # Página inicial (landing page)
│
│
└── README.md                     # 📖 Este arquivo de documentação
```

---


## 🗄️ Modelos do Banco de Dados

### Tabela: `users`

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INTEGER | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | Nome completo do usuário | NOT NULL |
| email | VARCHAR(255) | Email do usuário | NOT NULL, UNIQUE |
| phone | VARCHAR(11) | Telefone do usuário | NULL, 10-11 dígitos |
| password | VARCHAR(255) | Senha (sem criptografia) | NOT NULL |
| type | ENUM | Tipo de usuário | 'client' ou 'barbershop', NOT NULL |
| createdAt | DATETIME | Data de criação | AUTO |
| updatedAt | DATETIME | Data de atualização | AUTO |

---

### Tabela: `barbershops`

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INTEGER | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | Nome da barbearia | NOT NULL, UNIQUE |
| phone | VARCHAR(255) | Telefone da barbearia | NOT NULL |
| address | VARCHAR(255) | Endereço completo | NOT NULL |
| userId | INTEGER | ID do usuário dono | FOREIGN KEY → users(id), CASCADE |
| createdAt | DATETIME | Data de criação | AUTO |
| updatedAt | DATETIME | Data de atualização | AUTO |

**Relacionamento:**
- Um `User` (tipo barbershop) possui uma `Barbershop`
- Deletar `User` deleta a `Barbershop` (CASCADE)

---

### Tabela: `services`

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INTEGER | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | Nome do serviço | NOT NULL |
| price | DECIMAL(10,2) | Preço do serviço (R$) | NOT NULL, > 0 |
| duration | INTEGER | Duração em minutos | NOT NULL, 1-480 |
| barbershopId | INTEGER | ID da barbearia | FOREIGN KEY → barbershops(id), CASCADE |
| createdAt | DATETIME | Data de criação | AUTO |
| updatedAt | DATETIME | Data de atualização | AUTO |

**Relacionamento:**
- Uma `Barbershop` possui vários `Services`
- Deletar `Barbershop` deleta seus `Services` (CASCADE)

---

### Tabela: `schedules`

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| id | INTEGER | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| date | DATE | Data do agendamento | NOT NULL |
| time | TIME | Horário do agendamento | NOT NULL |
| status | ENUM | Status do agendamento | 'pending', 'confirmed', 'completed', 'canceled' |
| clientId | INTEGER | ID do cliente | FOREIGN KEY → users(id), CASCADE |
| barbershopId | INTEGER | ID da barbearia | FOREIGN KEY → barbershops(id), CASCADE |
| serviceId | INTEGER | ID do serviço | FOREIGN KEY → services(id), SET NULL |
| createdAt | DATETIME | Data de criação | AUTO |
| updatedAt | DATETIME | Data de atualização | AUTO |

**Relacionamentos:**
- Um `User` (cliente) pode ter vários `Schedules`
- Uma `Barbershop` pode ter vários `Schedules`
- Um `Service` pode estar em vários `Schedules`
- Deletar `User` ou `Barbershop` deleta os `Schedules` relacionados (CASCADE)
- Deletar `Service` mantém o `Schedule` mas define `serviceId` como NULL (SET NULL)

---

## 🔧 Troubleshooting Comum

### ❌ Erro: "Database connection failed"

**Problema**: O servidor não consegue se conectar ao MySQL.

**Soluções:**
1. Verifique se o XAMPP está rodando e o MySQL está ativo
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão com: `node testConnection.js`
4. Verifique se o banco `clubhair_db` foi criado no phpMyAdmin

---

### ❌ Erro: "Table doesn't exist"

**Problema**: As tabelas não foram criadas no banco de dados.

**Solução:**
Execute o script de sincronização:
```bash
node syncDatabase.js
```

---

### ❌ Erro: "Port 3000 already in use"

**Problema**: Já existe um processo rodando na porta 3000.

**Soluções:**
1. Mate o processo existente:
    - **Linux/Mac**: `lsof -ti:3000 | xargs kill -9`
    - **Windows**: `netstat -ano | findstr :3000` e depois `taskkill /PID <PID> /F`
2. Ou altere a porta no `server.js`

---

### ❌ Erro: "Cannot find module"

**Problema**: Dependências não foram instaladas.

**Solução:**
```bash
cd backend
npm install
```

---

### ❌ Erro: "CORS blocked"

**Problema**: Requisições do frontend sendo bloqueadas por CORS.

**Solução:**
O middleware CORS já está configurado no `app.js`. Certifique-se de que o servidor está rodando corretamente.

---

### ❌ Erro: "User not found" após login

**Problema**: LocalStorage não está salvando os dados do usuário.

**Soluções:**
1. Verifique o console do navegador (F12) para erros de JavaScript
2. Confirme que o navegador permite LocalStorage
3. Limpe o cache e LocalStorage: `localStorage.clear()`

---

### ❌ Erro: "Conflict: Este horário já está ocupado"

**Problema**: Tentativa de agendar um horário já reservado.

**Solução:**
Este é um comportamento esperado. Escolha outro horário disponível ou cancele o agendamento existente primeiro.

---


## 👩‍💻 Autoria

Projeto desenvolvido por **Adriana Toneatti** e **Larissa Amaral**.
