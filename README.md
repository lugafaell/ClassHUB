# ClassHUB - Plataforma Educacional Interativa

## 📋 Sobre o Projeto

ClassHUB é uma solução digital desenvolvida para simplificar a jornada educacional de alunos, professores e responsáveis. A plataforma oferece uma experiência intuitiva e responsiva, conectando todos os participantes do processo educacional através de notificações em tempo real e funcionalidades personalizadas para cada perfil de usuário.

### Principais Funcionalidades:
- Sistema de notificações em tempo real via Action Cable
- Dashboard personalizado para cada tipo de usuário
- Calendário integrado de atividades e eventos
- Sistema de mensagens entre alunos, professores e responsáveis
- Acompanhamento de desempenho acadêmico
- Design responsivo para acesso em qualquer dispositivo

## 🚀 Tecnologias Utilizadas

### Frontend
- React.js
- TypeScript
- CSS/SASS
- Axios para requisições HTTP
- Redux para gerenciamento de estado
- Material UI e Styled Components para interface

### Backend
- Ruby on Rails
- PostgreSQL
- Action Cable para WebSockets
- JWT para autenticação API

### DevOps
- Docker e Docker Compose

## 🔧 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v14 ou superior)
- Yarn ou NPM
- Ruby (v3.0 ou superior)
- Rails (v6.1 ou superior)
- PostgreSQL
- Docker (opcional, para containerização)

### Configurando o Backend

1. Clone o repositório:
```bash
git clone https://github.com/lugafaell/classHUB.git
cd classHUB/backend
```

2. Instale as dependências:
```bash
bundle install
```

3. Configure o banco de dados:
```bash
rails db:create
rails db:migrate
rails db:seed  # Para dados iniciais (opcional)
```

4. Inicie o servidor Rails:
```bash
rails s -p 3000
```

O backend estará disponível em `http://localhost:3000`.

### Configurando o Frontend

1. Navegue até a pasta do frontend:
```bash
cd ../frontend
```

2. Instale as dependências:
```bash
yarn install  # ou npm install
```

3. Configure o arquivo de ambiente:
Crie um arquivo `.env` na raiz do projeto frontend com:
```
REACT_APP_API_URL=http://localhost:3000/api
```

4. Inicie o servidor de desenvolvimento:
```bash
yarn start  # ou npm start
```

O frontend estará disponível em `http://localhost:5173`.

### Usando Docker (opcional)

Se preferir usar Docker, o projeto inclui configurações para Docker Compose:

```bash
docker-compose up
```

## 📱 Funcionalidades Mobile

A classHUB foi projetado com foco na experiência mobile, oferecendo:

- Design responsivo para diferentes tamanhos de tela
- Notificações push para dispositivos móveis
- Interface otimizada para touch

## 🔒 Autenticação e Segurança

- Autenticação via JWT para a API
- Diferentes níveis de acesso (aluno, professor, administrador)
- Proteção contra ataques CSRF
- Criptografia de dados sensíveis

## 📈 Monitoramento e Analytics

- Acompanhamento de engajamento dos usuários
- Métricas de desempenho acadêmico
- Relatórios para professores

## 📝 Contribuindo com o Projeto

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License.

## 🤝 Contato

Para dúvidas ou sugestões, entre em contato através do email: [rafaeldemenezes39@gmail.com](mailto:rafaeldemenezes39@gmail.com)
