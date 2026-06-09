# Stage 2: PostgreSQL

## Goal

Stage 2 adds PostgreSQL infrastructure for local development and keeps Docker Compose as an optional future deployment path.

The primary local development setup uses PostgreSQL 16 installed with Homebrew on macOS.

Docker Compose stays in the repository so the project can later move to a VPS or container-based deployment without changing application code.

## Primary Local Setup

```text
PostgreSQL 16 via Homebrew
```

## Homebrew PostgreSQL

Install and start PostgreSQL:

```zsh
brew install postgresql@16
brew services start postgresql@16
```

Check service status:

```zsh
brew services list
```

Check server readiness:

```zsh
$(brew --prefix postgresql@16)/bin/pg_isready -h localhost -p 5432
```

If `psql --version` shows an older PostgreSQL client, check the PostgreSQL 16 client directly:

```zsh
$(brew --prefix postgresql@16)/bin/psql --version
```

## Environment Variables

Local configuration is copied from `.env.example` to `.env`.

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_PORT
DATABASE_URL
```

## Local Commands

```zsh
cp .env.example .env
npm run db:start
npm run db:status
npm run db:version
npm run db:ready
npm run db:restart
npm run db:stop
```

## Local Role and Database

Create the application role:

```zsh
$(brew --prefix postgresql@16)/bin/createuser dog_health_app --pwprompt
```

Create the application database:

```zsh
$(brew --prefix postgresql@16)/bin/createdb dog_health_assistant --owner dog_health_app
```

Use the same password in `.env`:

```text
POSTGRES_PASSWORD=change_me_in_local_env
DATABASE_URL=postgresql://dog_health_app:change_me_in_local_env@localhost:5432/dog_health_assistant
```

## Local Connection String

For local development from the host machine:

```text
postgresql://dog_health_app:change_me_in_local_env@localhost:5432/dog_health_assistant
```

## Optional Docker Compose

The repository still includes `docker-compose.yml` for later use on a VPS or in a containerized deployment.

The Docker setup uses `postgres:16-alpine`, a named Docker volume, and a shared Docker network.

Docker commands:

```zsh
npm run db:docker:up
npm run db:docker:ps
npm run db:docker:logs
npm run db:docker:down
```

Docker network connection string for future containers:

```text
postgresql://dog_health_app:change_me_in_local_env@postgres:5432/dog_health_assistant
```

Prisma will use `DATABASE_URL` in Stage 4.
