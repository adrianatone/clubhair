📚 ClubHair — Sistema de Agendamento e Gestão para Barbearias

🧾 Sobre o Projeto
ClubHair é um sistema completo de gerenciamento de agendamentos e perfis, feito especialmente para barbearias de pequeno e médio porte e seus clientes.
Ele permite controlar cadastros de usuários e barbearias, criar e gerenciar serviços, além de agendar, confirmar ou cancelar atendimentos.

👉 O projeto foi desenvolvido com foco em uso local, para facilitar testes e futuras expansões.

🚀 Tecnologias Utilizadas
Tecnologia    |    Descrição|
---------------------------------------------------------------
Node.js          (Back-End)  | Ambiente de execução JavaScript server-side.
Express          (Back-End)  | Framework minimalista de rotas e middlewares
Sequelize        (Back-End)  | ORM para comunicação com banco de dados MySQL.
MySQL(via XAMPP) (Back-End)  | Banco de dados relacional utilizado localmente.
JavaScript       (Front-End) | Programação de toda interação no front-end.
HTML5/CSS3       (Front-End) | Estrutura e estilização das páginas.
---------------------------------------------------------------
Auxiliares    |    Descrição|
---------------------------------------------------------------
XAMPP         | Ambiente de desenvolvimento com MySQL.
POSTMAN       | Testes de rotas HTTP (API).
VSCODE        | Editor.

🛠️ Ferramentas Recomendadas
Ferramenta       |       Uso
---------------------------------------------------------------
XAMPP            |  MySQL Server local para banco de dados.
VSCode           |  Editor de código recomendado.
Postman          |  Testar rotas de API e endpoints.
Node.js          |  Ambiente de execução JavaScript.
NPM/Yarn         |  Gerenciador de dependências.

⚙️ Como Configurar o Projeto Localmente
1️⃣ Configure o Banco de Dados:

Abra o XAMPP e ative Apache e MySQL.

Abra o phpMyAdmin (padrão: localhost/phpmyadmin).

Crie um banco de dados com o nome 'clubhair_db' utilizando 'utf8_general_ci'.

2️⃣ Configure o .env:

No diretório clubhair-backend, crie um .env:
```
DB_NAME=clubhair_db
DB_USER=root
DB_PASS=              # Deixe vazio se for XAMPP sem senha
DB_HOST=localhost
```
3️⃣ Instale as dependências:

No terminal, navegue até a pasta clubhair-backend e execute:
`npm install`

4️⃣ Sincronize o banco de dados:
No terminal dentro da pasta clubhair-backend:
`node syncDatabase.js`
Isso criará todas as tabelas (users, barbershops, services e schedules) baseadas nos models.

5️⃣ Inicie o servidor:
No terminal dentro da pasta clubhair-backend:
`node server.js`
(Isso iniciará o backend para que todas as APIS funcionem.)
Se fez todas as etapas corretamente irá receber a resposta no terminal:
✅ Database connected successfully!
🚀 Server is running at: http://localhost:3000
(acesse http://localhost:3000, se a mensagem exibida for 'ClubHair API is running!' está tudo funcionando)

6️⃣ Abra o Front-End:
Navegue até clubhair-frontend/pages/shared/index.html e abra no navegador.

🎯 Fluxo de Funcionamento
Usuário Cliente:
Cria conta → Visualiza barbearias → Agenda serviços → Acompanha status → Pode cancelar.

Barbearia:
Cria conta → Cadastra serviços → Recebe agendamentos → Confirma, Conclui ou Cancela.

# Todo fluxo é controlado por:

Back-End (API) Express

MySQL com Sequelize

JavaScript no Front-End
(Armazena o usuário logado no localStorage)

🗂️ Estrutura de Pastas Comentada
ClubHair/
│
├── .vscode/                   # Configuração do VSCode
│   └── settings.json          # Configurações do editor
│
├── clubhair-backend/          # Diretório do Back-End
│   ├── config/                
│   │   └── database.js        # Configuração de conexão com o banco de dados
│   │
│   ├── models/                # Models do Sequelize (estrutura do banco)
│   │   ├── User.js            # Model de Usuário
│   │   ├── Barbershop.js      # Model de Barbershop
│   │   ├── Service.js         # Model de Service
│   │   └── Schedule.js        # Model de Schedule
│   │
│   ├── routes/                # Rotas da API
│   │   ├── users.js           # Rotas de usuários
│   │   ├── barbershops.js     # Rotas de barbearias
│   │   ├── services.js        # Rotas de serviços
│   │   └── schedules.js       # Rotas de agendamentos
│   │
│   ├── .env                   # Variáveis de ambiente
│   ├── .gitignore             # Ignorar arquivos sensíveis
│   ├── app.js                 # Configuração principal do Express
│   ├── package-lock.json      # Dependências travadas
│   ├── package.json           # Dependências e scripts
│   ├── server.js              # Inicialização do servidor
│   ├── syncDatabase.js        # Sincronizar models com o banco
│   └── testConnection.js      # Testar conexão com o banco de dados
│
├── clubhair-frontend/        
│   ├── assets/                # Recursos visuais e scripts
│   │    ├── css/              # Estilos separados por função
│   │    │    └── (Barbearia e Usuário — páginas individuais)
│   │    └── js/               # JavaScript separado por componente
│   │         └── (Barbearia e Usuário — páginas individuais)
│   │
│   ├── images/                # Imagens do projeto (logo, ícones, etc.)
│   │   └── logo.png           
│   │
│   ├── pages/                 # Páginas HTML organizadas
│   │    ├── barbershop/       # Fluxo de barbearia
│   │    └── user/             # Fluxo de cliente
│   │
│   └── shared/                # Arquivos comuns a todos
│       ├── index.html         # Página inicial do sistema
│       └── style.css          # Estilo da página inicial
│
└── README.md                  # Documentação e instruções
