# Stage 12: Health Events CRUD

## Goal

Stage 12 adds authenticated CRUD API for dog medical events.

The backend part is complete in this step. Frontend integration should be handled next, with the user choosing whether to implement the React part for practice.

## Architectural Decision

Health events belong to a dog, and dogs belong to the current authenticated user.

Every operation is scoped by:

```text
request.user.sub
dogId
```

This prevents users from reading or changing medical events for dogs owned by another account.

The module follows the existing backend structure:

```text
presentation
application
domain
infrastructure
```

## Files

```text
apps/api/src/modules/health-events/health-events.module.ts
apps/api/src/modules/health-events/domain/health-event-record.ts
apps/api/src/modules/health-events/domain/health-event-type.ts
apps/api/src/modules/health-events/domain/health-events.repository.ts
apps/api/src/modules/health-events/application/list-current-user-health-events.use-case.ts
apps/api/src/modules/health-events/application/get-current-user-health-event.use-case.ts
apps/api/src/modules/health-events/application/create-current-user-health-event.use-case.ts
apps/api/src/modules/health-events/application/update-current-user-health-event.use-case.ts
apps/api/src/modules/health-events/application/delete-current-user-health-event.use-case.ts
apps/api/src/modules/health-events/infrastructure/prisma-health-events.repository.ts
apps/api/src/modules/health-events/presentation/health-events.controller.ts
apps/api/src/modules/health-events/presentation/dto/create-health-event.dto.ts
apps/api/src/modules/health-events/presentation/dto/update-health-event.dto.ts
apps/api/src/modules/health-events/presentation/dto/health-event-response.dto.ts
apps/api/src/app.module.ts
```

## API

All endpoints require:

```text
Authorization: Bearer <jwt>
```

Endpoints:

```text
GET /api/dogs/:dogId/health-events
POST /api/dogs/:dogId/health-events
GET /api/dogs/:dogId/health-events/:id
PATCH /api/dogs/:dogId/health-events/:id
DELETE /api/dogs/:dogId/health-events/:id
```

## Health Event Fields

```text
type
title
eventDate
nextReminderDate
notes
```

Supported types:

```text
vaccination
deworming
tick_treatment
flea_treatment
weight_tracking
vet_visit
surgery
other
```

## Commands

```zsh
npm run api:typecheck
npm run api:build
npm run lint
npm run typecheck
```

## Swagger

```text
http://localhost:3000/api/docs
```

## Typical Issues

```text
401 Unauthorized means the Authorization header is missing or the JWT is invalid.
404 Not Found means the dog or health event does not exist or belongs to another user.
eventDate and nextReminderDate must be ISO date strings.
type must be one of the supported medical event types.
```

## Frontend Follow-Up

The React part should connect:

```text
HealthPage
Dog selector
React Query hooks
API client with JWT
Create health event form
Health event history list
Delete health event action
```

Before implementing the frontend part, ask whether the user wants to write it for practice.
