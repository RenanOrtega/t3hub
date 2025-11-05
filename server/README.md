# T3 Hub Backend

Backend API para a plataforma T3 Hub - LoL Tier 3 SaaS.

## Stack

- **Fastify** - Fast web framework
- **Drizzle ORM** - Type-safe ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **TypeScript** - Type safety

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar PostgreSQL

Certifique-se de ter o PostgreSQL rodando localmente ou configure a `DATABASE_URL` no `.env`:

```bash
# Criar database
createdb t3hub

# Ou via psql
psql -U postgres
CREATE DATABASE t3hub;
```

### 3. Gerar e rodar migrations

```bash
# Gerar migrations do schema
npm run db:generate

# Aplicar migrations
npm run db:migrate
```

### 4. Rodar servidor

```bash
# Development com hot reload
npm run dev

# Production
npm run build
npm start
```

### 5. Drizzle Studio (opcional)

Explore o banco de dados visualmente:

```bash
npm run db:studio
```

Acesse: http://localhost:4983

## API Endpoints

### Health Check
- `GET /health` - Verifica se o servidor está rodando

### Players
- `GET /api/players` - Lista players (com filtros)
- `GET /api/players/:id` - Busca player por ID
- `POST /api/players` - Cria player
- `PATCH /api/players/:id` - Atualiza player
- `DELETE /api/players/:id` - Deleta player

**Query params para filtros:**
- `lane` - Filtra por lane (Top, Jungle, Mid, ADC, Support)
- `minElo` - Elo mínimo
- `maxElo` - Elo máximo
- `availabilityStatus` - Status (Active, Free Agent, Inactive)

### Scrim Slots
- `GET /api/scrims` - Lista slots
- `GET /api/scrims/:id` - Busca slot por ID
- `POST /api/scrims` - Cria slot
- `PATCH /api/scrims/:id` - Atualiza slot
- `DELETE /api/scrims/:id` - Deleta slot

### Scrim Requests
- `GET /api/scrim-requests` - Lista requests
- `GET /api/scrim-requests/:id` - Busca request por ID
- `POST /api/scrim-requests` - Cria request
- `PATCH /api/scrim-requests/:id` - Atualiza request (aceitar/rejeitar)
- `DELETE /api/scrim-requests/:id` - Deleta request

## Environment Variables

Veja `.env.example` para todas as variáveis disponíveis.
