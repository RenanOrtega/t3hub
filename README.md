# T3 Hub - LoL Tier 3 SaaS Platform

Plataforma profissional para conectar jogadores e organizações de League of Legends Tier 3, facilitando scouting e agendamento de scrims.

## 🚀 Stack

### Frontend
- **Vite + React + TypeScript**
- **Tailwind CSS v4** - Styling moderno
- **shadcn/ui** - Componentes acessíveis
- **React Query** - Data fetching
- **React Router** - Navegação

### Backend
- **Fastify** - Web framework performático
- **Drizzle ORM** - Type-safe database
- **PostgreSQL** - Banco relacional
- **Zod** - Validação de schemas
- **TypeScript** - Type safety e2e

## 📁 Estrutura

```
t3hub/
├── client/          # Frontend React
├── server/          # Backend Fastify
└── docker-compose.yml
```

## 🛠️ Setup Completo

### 1. Clonar repositório

```bash
git clone <repo-url>
cd t3hub
```

### 2. Iniciar PostgreSQL

```bash
docker-compose up -d
```

### 3. Setup Backend

```bash
cd server
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Backend rodando em: `http://localhost:3000`

### 4. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend rodando em: `http://localhost:5173`

## 🎯 Features MVP

### Player Profiling
- ✅ Perfis de jogadores com IGN, lanes, elo, champion pool
- ✅ Busca e filtros por lane e elo
- ✅ Status de disponibilidade (Active/Free Agent)

### Scrim Scheduling
- ✅ Board de slots disponíveis
- ✅ Sistema de requests (Pending/Accepted/Rejected)
- ✅ Filtros por elo e data
- ✅ Status tracking (Open/Confirmed/Completed)

## 📝 Coding Guidelines

Veja [CLAUDE.md](./CLAUDE.md) para as guidelines completas do projeto.

## 🗄️ Database Schema

- **User** - Autenticação e roles
- **Organization** - Times/orgs
- **Team** - Rosters específicos
- **Player** - Perfis de jogadores
- **Roster** - Vínculo player-team
- **ScrimSlot** - Slots disponíveis
- **ScrimRequest** - Solicitações de scrim

## 🔧 Scripts Úteis

### Backend
```bash
npm run dev          # Dev server
npm run db:studio    # Drizzle Studio
npm run db:generate  # Gerar migrations
```

### Frontend
```bash
npm run dev          # Dev server
npm run build        # Build produção
```

## 📚 API Documentation

Veja [server/README.md](./server/README.md) para documentação completa da API.
