# Stage 11: Heat Cycles CRUD

## Goal

Stage 11 adds authenticated CRUD API for dog heat cycles.

The backend part is complete in this step. Frontend integration should be handled next, with the user choosing whether to implement the React part for practice.

## Architectural Decision

Heat cycles belong to a dog, and dogs belong to the current authenticated user.

Every operation is scoped by:

```text
request.user.sub
dogId
```

This prevents users from reading or changing heat cycles for dogs owned by another account.

The module follows the existing backend structure:

```text
presentation
application
domain
infrastructure
```

## Files

```text
apps/api/src/modules/heat-cycles/heat-cycles.module.ts
apps/api/src/modules/heat-cycles/domain/heat-cycle-record.ts
apps/api/src/modules/heat-cycles/domain/heat-cycles.repository.ts
apps/api/src/modules/heat-cycles/application/calculate-heat-cycle-duration.ts
apps/api/src/modules/heat-cycles/application/list-current-user-heat-cycles.use-case.ts
apps/api/src/modules/heat-cycles/application/get-current-user-heat-cycle.use-case.ts
apps/api/src/modules/heat-cycles/application/create-current-user-heat-cycle.use-case.ts
apps/api/src/modules/heat-cycles/application/update-current-user-heat-cycle.use-case.ts
apps/api/src/modules/heat-cycles/application/delete-current-user-heat-cycle.use-case.ts
apps/api/src/modules/heat-cycles/infrastructure/prisma-heat-cycles.repository.ts
apps/api/src/modules/heat-cycles/presentation/heat-cycles.controller.ts
apps/api/src/modules/heat-cycles/presentation/dto/create-heat-cycle.dto.ts
apps/api/src/modules/heat-cycles/presentation/dto/update-heat-cycle.dto.ts
apps/api/src/modules/heat-cycles/presentation/dto/heat-cycle-response.dto.ts
apps/api/src/app.module.ts
```

## API

All endpoints require:

```text
Authorization: Bearer <jwt>
```

Endpoints:

```text
GET /api/dogs/:dogId/heat-cycles
POST /api/dogs/:dogId/heat-cycles
GET /api/dogs/:dogId/heat-cycles/:id
PATCH /api/dogs/:dogId/heat-cycles/:id
DELETE /api/dogs/:dogId/heat-cycles/:id
```

## Heat Cycle Fields

```text
startDate
endDate
duration
predicted
notes
```

Duration is calculated automatically when `endDate` is present.

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
404 Not Found means the dog or heat cycle does not exist or belongs to another user.
startDate and endDate must be ISO date strings.
duration is not accepted from the client because it is calculated by the backend.
```

## Frontend Follow-Up

The React part should connect:

```text
HeatCyclesPage
Dog selector
React Query hooks
API client with JWT
Create heat cycle form
Heat cycle history list
Delete heat cycle action
```

Before implementing the frontend part, ask whether the user wants to write it for practice.
