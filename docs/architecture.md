# Dog Health Assistant Architecture

## Goal

Dog Health Assistant is designed as a long-lived commercial product that works both as a Telegram Mini App and as a standalone web application.

The main login path is Telegram. The same product capabilities must be available in Telegram WebView and in a browser.

## Monorepository

The project uses npm workspaces.

```text
apps/
  api/
  bot/
  web/
packages/
  shared/
docs/
```

## Applications

### apps/api

`apps/api` will contain the NestJS REST API.

Expected modules:

- Auth
- Users
- Dogs
- Heat Cycles
- Health Events
- Reminders
- Symptom Analysis
- Knowledge Base

The API must use Clean Architecture, DTOs, services, repositories, dependency injection, Prisma ORM, PostgreSQL, JWT, guards, validation, rate limiting, Swagger, and environment variables.

### apps/bot

`apps/bot` will contain the Telegram Bot.

The bot will launch the Mini App, send reminders, provide quick access to events, and route users to specific app sections.

### apps/web

`apps/web` will contain one React application that supports two runtime modes:

- Telegram Mini App mode using Telegram WebApp initData.
- Standalone web app mode using Telegram Login.

The UI is mobile-first and must adapt to desktop layouts.

## Shared Package

`packages/shared` contains framework-independent TypeScript contracts used by multiple apps.

At this stage it contains stable enums and interfaces for the product domain. Backend DTOs and database models will be added in later stages where they belong.

## Clean Architecture Boundaries

Each backend feature should be organized around these layers:

- `domain`: entities, value objects, domain rules, repository interfaces.
- `application`: use cases and orchestration.
- `infrastructure`: Prisma repositories, external providers, Telegram/OpenAI adapters.
- `presentation`: REST controllers, DTOs, guards, pipes, Swagger decorators.

Frontend code should keep API access, routing, state, and UI components separated.

## Future Scalability

The architecture must allow adding family access, multiple owners, exports, analytics, AI assistant features, clinic integrations, and mobile apps without a full rewrite.

The infrastructure must support moving from the user's existing server to a European VPS without code changes.
