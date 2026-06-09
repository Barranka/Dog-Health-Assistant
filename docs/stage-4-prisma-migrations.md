# Stage 4: Prisma and Migrations

## Goal

Stage 4 connects Prisma ORM to PostgreSQL and creates the first database migration.

## Schema

The Prisma schema is located at:

```text
apps/api/prisma/schema.prisma
```

Prisma 7 configuration is located at:

```text
apps/api/prisma.config.ts
```

## Models

```text
User
Dog
HeatCycle
HealthEvent
Reminder
SymptomReport
KnowledgeArticle
```

## API Infrastructure

The NestJS API now includes a global database module:

```text
apps/api/src/infrastructure/database/database.module.ts
apps/api/src/infrastructure/database/prisma.service.ts
```

`PrismaService` uses the PostgreSQL adapter required by Prisma 7, connects when the NestJS application starts, and disconnects when it shuts down.

## Commands

Generate Prisma Client:

```zsh
npm run prisma:generate
```

Create and apply a migration:

```zsh
npm run prisma:migrate:dev -- --name init
```

Check migration status:

```zsh
npm run prisma:migrate:status
```

Open Prisma Studio:

```zsh
npm run prisma:studio
```

## Environment

Prisma reads the PostgreSQL connection from:

```text
DATABASE_URL
```

The value is defined locally in `.env`.

The API workspace reads the root `.env` file from:

```text
../../.env
```

The API bootstrap also calls `loadEnvironment()` before NestJS starts, so `DATABASE_URL` is available before `PrismaService` is created.
