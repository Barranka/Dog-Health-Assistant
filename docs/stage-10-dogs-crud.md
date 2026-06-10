# Stage 10: Dogs CRUD

## Goal

Stage 10 adds authenticated CRUD API for dog profiles.

The backend part is complete in this step. Frontend integration will be done next after choosing whether the user wants to implement the React part for practice.

## Architectural Decision

Dogs belong to the current authenticated user.

Every operation is scoped by:

```text
request.user.sub
```

This prevents users from reading or changing dogs owned by another account.

The module follows the existing backend structure:

```text
presentation
application
domain
infrastructure
```

## Files

```text
apps/api/src/modules/dogs/dogs.module.ts
apps/api/src/modules/dogs/domain/dog-profile.ts
apps/api/src/modules/dogs/domain/dog-sex.ts
apps/api/src/modules/dogs/domain/dogs.repository.ts
apps/api/src/modules/dogs/application/list-current-user-dogs.use-case.ts
apps/api/src/modules/dogs/application/get-current-user-dog.use-case.ts
apps/api/src/modules/dogs/application/create-current-user-dog.use-case.ts
apps/api/src/modules/dogs/application/update-current-user-dog.use-case.ts
apps/api/src/modules/dogs/application/delete-current-user-dog.use-case.ts
apps/api/src/modules/dogs/infrastructure/prisma-dogs.repository.ts
apps/api/src/modules/dogs/presentation/dogs.controller.ts
apps/api/src/modules/dogs/presentation/dto/create-dog.dto.ts
apps/api/src/modules/dogs/presentation/dto/update-dog.dto.ts
apps/api/src/modules/dogs/presentation/dto/dog-response.dto.ts
apps/api/src/app.module.ts
```

## API

All endpoints require:

```text
Authorization: Bearer <jwt>
```

Endpoints:

```text
GET /api/dogs
POST /api/dogs
GET /api/dogs/:id
PATCH /api/dogs/:id
DELETE /api/dogs/:id
```

## Dog Fields

```text
name
breed
sex
birthDate
weight
color
sterilized
notes
```

Supported sex values:

```text
female
male
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
404 Not Found means the dog does not exist or belongs to another user.
birthDate must be an ISO date string.
weight supports up to two decimal places.
```

## Frontend Follow-Up

The React part connects:

```text
DogsPage
React Query hooks
API client with JWT
Create dog form
Empty state backed by real API data
AuthGate
LoginPage
Telegram Login Widget
Development login for localhost
```

Development login is exposed through:

```text
POST /api/auth/dev-login
```

It is available only when:

```text
NODE_ENV=development
```

This allows local browser testing on `http://localhost:5173` without Telegram domain setup.

Standalone web login through Telegram Login Widget
