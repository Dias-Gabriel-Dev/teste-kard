# CRUD CNAE — Teste Técnico Kard

API REST para gerenciamento de registros de CNAE (Classificação
Nacional de Atividades Econômicas) com operações de criação,
consulta, atualização e exclusão lógica.

## Tecnologias

- **Node.js** + **TypeScript**
- **Express** — Framework HTTP
- **Prisma ORM** — Acesso a dados e migrations
- **PostgreSQL** — Banco de dados relacional
- **Zod** — Validação de schemas
- **Swagger UI** — Documentação interativa da API
- **Vitest + Supertest** — Testes de integração
- **Docker** — PostgreSQL containerizado.

## Como Executar

### Pré-requisitos

- Node.js >= 18
- Docker e Docker Compose
- npm

### 1. Clonar e instalar dependências

    git clone <url-do-repositorio>
    cd teste-kard
    npm install

### 2. Configurar variáveis de ambiente

    cp .env.example .env

Edite o `.env` se necessário (os valores padrão funcionam
com o Docker Compose fornecido).

### 3. Subir o banco de dados

    docker compose up -d

### 4. Rodar migrations

    npx prisma migrate deploy

### 5. (Opcional) Popular dados de exemplo

    npm run db:seed

### 6. Iniciar o servidor

    npm run dev

O servidor estará disponível em `http://localhost:3000`.

## Documentação da API

- **Swagger UI**: <http://localhost:3000/api/docs>
- **Spec JSON**: <http://localhost:3000/api/docs/json>
- **Health Check**: <http://localhost:3000/health>

## Endpoints

| Método | Rota              | Descrição                    |
|--------|-------------------|------------------------------|
| POST   | /api/cnaes        | Criar registro               |
| GET    | /api/cnaes        | Listar com paginação         |
| GET    | /api/cnaes/:id    | Buscar por ID                |
| PUT    | /api/cnaes/:id    | Atualizar registro           |
| DELETE | /api/cnaes/:id    | Exclusão lógica (soft delete)|

## Testes

    npm test

## Estrutura da API

```text
src/
    ├── config/env.ts              # Validação de env vars
    ├── docs/swagger.ts            # Spec OpenAPI 3.0
    ├── lib/prisma.ts              # Prisma Client singleton
    ├── modules/cnae/
    │   ├── cnaeSchema.ts         # Validação Zod
    │   ├── cnaeRepository.ts     # Acesso a dados
    │   ├── cnaeService.ts        # Lógica de negócio
    │   ├── cnaeController.ts     # Handlers HTTP
    │   └── cnaeRoutes.ts         # Rotas Express
    ├── shared/
    │   ├── errors/appError.ts    # Erro customizado
    │   └── middlewares/
    │       ├── errorHandler.ts   # Middleware de erro
    │       └── validate.ts        # Middleware de validação
    ├── tests/
    │   ├── setup.ts               # Setup dos testes
    │   └── cnae.test.ts           # Testes de endpoints
    ├── app.ts                     # Configuração Express
    └── server.ts                  # Bootstrap do servidor
```