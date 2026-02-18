# ilia - Fullstack NodeJs Challenge Solution made by Yoac-Eng

Fullstack solution for the ilia challenge that consists in 2 services and 1 frontend within this monorepo(kept for challenge avaliation porpuses):

- `users` microservice (NestJS + Prisma + PostgreSQL) on port `3002`
- `transactions` microservice (NestJS + Prisma + PostgreSQL) on port `3001`
- Next.js frontend (TypeScript + Tailwind + shadcn/ui) on port `3000`


<!-- ![diagram](diagram.png) -->

## 📍 Table of Contents
- [Tech Stack](#tech-stack)
- [How to Run (Docker)](#run-with-docker-compose)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Testing](#running-tests)
- [Security Model](#security-model)
- [Frontend Overview](#frontend-features)

## Monorepo Structure

```text
.
├── backend
│   ├── apps/users
│   └── apps/transactions
├── frontend
└── docker-compose.yml
```

## Tech Stack

- Backend: Node.js, NestJS, Prisma, PostgreSQL
- Frontend: Next.js (App Router), TypeScript, NextAuth, TanStack Query, Tailwind CSS, shadcn/ui
- Infra: Docker, Docker Compose
- Validation: Zod

![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![License](https://img.shields.io/badge/license-MIT-blue)

## Services and Ports

- Frontend: `http://localhost:3000`
- Users API: `http://localhost:3002`
- Transactions API (Wallet): `http://localhost:3001`

## Run with Docker Compose
### Note: In here the docker compose has enough env variables fallbacks to be able to run without .env configuration, but that wouldnt be possible in a production/homolog scenario.

From repository root:

```bash
docker compose up --build -d
```

This starts:
- frontend (`3000`)
- users-service (`3002`)
- transactions-service (`3001`)
- postgres-users (`5432`)
- postgres-transactions (`5433`)

To stop:

```bash
docker compose down
```

## Environment Variables
### Note: In a production scenario envs wouldnt be set here (only a .env.example), this is only for development/challenge test porpuse.

If you want to run the project locally, create a `.env` at repository root (used by Docker Compose) and configure:

```env
NODE_ENV=development

# challenge-required secrets (optional in compose, defaults are already set)
JWT_SECRET=ILIACHALLENGE
INTERNAL_JWT_SECRET=ILIACHALLENGE_INTERNAL

# database (docker defaults can be kept)
POSTGRES_USER=ilia
POSTGRES_PASSWORD=ilia123
POSTGRES_DB_USERS=ilia_users
POSTGRES_DB_TRANSACTIONS=ilia_transactions
POSTGRES_USERS_PORT=5432
POSTGRES_TRANSACTIONS_PORT=5433

# app ports
USERS_PORT=3002
TRANSACTIONS_PORT=3001

# frontend browser/auth urls
NEXTAUTH_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
AUTH_SECRET=
```

In Docker Compose, `USERS_DATABASE_URL` and `TRANSACTIONS_DATABASE_URL` are assembled automatically from Postgres variables.

When running locally (without Docker), use:

```env
USERS_DATABASE_URL=postgresql://ilia:ilia123@localhost:5432/ilia_users
TRANSACTIONS_DATABASE_URL=postgresql://ilia:ilia123@localhost:5433/ilia_transactions
USERS_SERVICE_URL=http://localhost:3002
```

## Run Locally (without Docker)

### 1) Backend

```bash
cd backend
pnpm install
```

Run migrations:

```bash
pnpm db:users:migrate:dev
pnpm db:transactions:migrate:dev
```

Start services in separate terminals:

```bash
pnpm start:dev:users
pnpm start:dev:transactions
```

### 2) Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## 🧪 Running Tests

### Backend (both user and transaction services)
```bash
cd backend
pnpm test          # Unit tests
pnpm test:e2e      # End-to-end tests
```

## API Overview

### Users service (`3002`)

- `POST /users` (public): register user
- `POST /auth` (public): authenticate user
- `GET /users` (protected)
- `GET /users/:id` (protected)
- `PATCH /users/:id` (protected)
- `DELETE /users/:id` (protected)
- `GET /users/:id/exists` (internal token only)

### Transactions service (`3001`)

- `GET /balance` (protected)
- `GET /transactions` (protected)
- `POST /transactions` (protected)
  - validates body `user_id` matches authenticated token `sub`

## Security Model

- All non-public routes use JWT auth.
- External auth secret: `JWT_SECRET`.
- Internal service-to-service auth secret: `INTERNAL_JWT_SECRET`.
- Users endpoint `GET /users/:id/exists` is internal-only.
- Transactions service signs internal token when calling users service.

## Frontend Features

- Authentication (register/login/logout)
- Wallet balance display
- Transaction list with filtering
- Credit and debit operations
- Loading, empty, and error states
- i18n support (`en`, `pt-br`)
- Responsive layout

## Manual Verification Flow

1. Register a new user from frontend.
2. Login and confirm session starts.
3. Open wallet page and confirm balance endpoint works.
4. Create a credit transaction.
5. Create a debit transaction.
6. Confirm transactions list and updated balance.
7. Switch language and verify UI translations.

## Notes

- A single global README is used to document all services and frontend, but this could be split to every service and frontend having their own readme.

# And thanks for the opportunity :)
