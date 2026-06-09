# Dog Health Assistant

Dog Health Assistant is a commercial Telegram Mini App and standalone web application for dog owners.

The product combines heat cycle tracking, health calendar events, reminders, symptom analysis, and a knowledge base.

## Monorepository Layout

```text
apps/
  api/      NestJS REST API
  bot/      Telegram Bot
  web/      React Telegram Mini App and standalone web app
packages/
  shared/   Shared domain types and cross-app utilities
docs/
  architecture.md
```

## Stage 1 Scope

This stage creates the architecture and monorepository foundation only.

Backend, frontend, Docker, PostgreSQL, Prisma, Telegram authentication, and bot implementation are intentionally left for the next stages from `PROJECT_PROMPT.md`.

## Requirements

Use macOS-compatible commands with zsh.

Node.js 22 or newer and npm 10 or newer are expected.

## Commands

```zsh
npm install
npm run typecheck
npm run lint
npm run format:check
```

## Local PostgreSQL With Homebrew

Stage 2 uses local PostgreSQL 16 installed with Homebrew for development.

```zsh
brew install postgresql@16
brew services start postgresql@16
cp .env.example .env
npm run db:status
npm run db:version
npm run db:ready
```

If `psql --version` shows an older PostgreSQL client, use the Homebrew PostgreSQL 16 binary directly:

```zsh
$(brew --prefix postgresql@16)/bin/psql --version
```

Create the local database role and database before connecting the backend:

```zsh
$(brew --prefix postgresql@16)/bin/createuser dog_health_app --pwprompt
$(brew --prefix postgresql@16)/bin/createdb dog_health_assistant --owner dog_health_app
```

Docker Compose remains available as an optional future deployment-oriented setup.

```zsh
npm run db:docker:up
npm run db:docker:ps
npm run db:docker:logs
npm run db:docker:down
```
