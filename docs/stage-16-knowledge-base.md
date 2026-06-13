# Stage 16: Knowledge Base

## Goal

Move the knowledge base from hardcoded frontend labels to database-backed articles that can be seeded without an admin panel.

## Implemented

- Added locale support to `KnowledgeArticle`.
- Added article tree fields:
  - `group`
  - `slug`
- Added unique article key by `slug` and `locale`.
- Added seed command with initial RU/EN articles for six knowledge groups.
- Added public API endpoints:
  - `GET /api/knowledge?locale=ru`
  - `GET /api/knowledge?locale=ru&group=reproductive_cycle`
  - `GET /api/knowledge?locale=ru&group=reproductive_cycle&search=течка`
  - `GET /api/knowledge/:id`
- Updated the web knowledge page:
  - category cards
  - article list per category
  - search inside category
  - article detail screen
  - related articles
  - local favorites
  - local recently viewed articles
  - local helpful action

## Commands

Apply the migration:

```bash
npm run prisma:migrate:dev
```

Seed the initial articles:

```bash
npm run prisma:seed
```

## Notes

- There is no admin panel yet.
- Content is stored in code as seed data and synced into PostgreSQL.
- Re-running the seed updates existing articles by slug and locale.
