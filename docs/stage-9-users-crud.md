# Stage 9: Users CRUD

## Goal

Stage 9 adds authenticated user profile management.

User creation still happens through Telegram authorization. The Users API manages the current authenticated user's profile.

## Architectural Decision

The Users module follows the existing backend structure:

```text
presentation
application
domain
infrastructure
```

The module uses JWT authentication and does not expose a public users list.

This keeps user data private and prepares the API for dog ownership in the next stage.

## Files

```text
apps/api/src/modules/users/users.module.ts
apps/api/src/modules/users/domain/user-profile.ts
apps/api/src/modules/users/domain/users.repository.ts
apps/api/src/modules/users/application/get-current-user-profile.use-case.ts
apps/api/src/modules/users/application/update-current-user-profile.use-case.ts
apps/api/src/modules/users/application/delete-current-user.use-case.ts
apps/api/src/modules/users/infrastructure/prisma-users.repository.ts
apps/api/src/modules/users/presentation/users.controller.ts
apps/api/src/modules/users/presentation/dto/update-current-user.dto.ts
apps/api/src/modules/users/presentation/dto/user-profile-response.dto.ts
apps/api/src/app.module.ts
apps/api/src/modules/auth/auth.module.ts
```

## API

All endpoints require:

```text
Authorization: Bearer <jwt>
```

Endpoints:

```text
GET /api/users/me
PATCH /api/users/me
DELETE /api/users/me
```

Create user flow:

```text
POST /api/auth/telegram-mini-app
POST /api/auth/telegram-login
```

## Commands

```zsh
npm run api:dev
npm run api:typecheck
npm run api:build
npm run lint
```

## Swagger

```text
http://localhost:3000/api/docs
```

## Typical Issues

```text
401 Unauthorized means the Authorization header is missing or the JWT is invalid.
404 Not Found means the JWT points to a user that no longer exists.
PATCH accepts only firstName and username.
DELETE /api/users/me also deletes related dogs later because User has cascading dog ownership.
```

## Impact On Next Stages

Stage 10 can connect dogs to the authenticated user through `request.user.sub`.

The API already has a safe ownership boundary for user-scoped resources.
