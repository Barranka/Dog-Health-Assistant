# Stage 3: NestJS Backend

## Goal

Stage 3 creates the initial NestJS REST API application.

This stage does not include Prisma, database repositories, Telegram authentication, bot logic, or CRUD modules. Those features belong to later stages from `PROJECT_PROMPT.md`.

## Application

```text
apps/api
```

## Architecture

The API follows Clean Architecture boundaries from the first stage.

The first implemented module is `health`, organized as:

```text
domain
application
presentation
```

The infrastructure layer will be added with Prisma in Stage 4.

## Runtime Features

The API includes:

- NestJS application bootstrap
- Global `/api` prefix
- CORS
- Helmet
- Global validation pipe
- Environment validation
- Swagger documentation
- Health endpoint

## Environment Variables

```text
NODE_ENV
API_PORT
DATABASE_URL
```

`DATABASE_URL` is already present for the upcoming Prisma stage, but the API does not connect to the database in Stage 3.

## Commands

```zsh
npm run api:dev
npm run api:build
npm run api:start
npm run api:typecheck
```

## Endpoints

```text
GET /api/health
GET /api/docs
```

## Health Response

```json
{
  "status": "ok",
  "service": "api",
  "uptime": 12.345,
  "timestamp": "2026-06-09T12:00:00.000Z"
}
```

## Notes For Later Stages

Stage 4 will add Prisma and PostgreSQL integration.

Stage 5 will add Telegram authentication.
