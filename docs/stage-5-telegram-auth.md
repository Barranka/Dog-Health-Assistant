# Stage 5: Telegram Authentication

## Goal

Stage 5 adds Telegram-based authorization to the NestJS API.

The API supports two entry points:

```text
Telegram Mini App initData
Telegram Login widget payload
```

## Endpoints

```text
POST /api/auth/telegram-mini-app
POST /api/auth/telegram-login
GET /api/auth/me
```

## Security

Telegram signatures are verified with HMAC.

Mini App verification uses:

```text
HMAC_SHA256(data_check_string, HMAC_SHA256(bot_token, "WebAppData"))
```

Telegram Login verification uses:

```text
HMAC_SHA256(data_check_string, SHA256(bot_token))
```

Both flows validate `auth_date` freshness.

## Persistence

Authorized Telegram users are upserted into the `users` table by `telegramId`.

## JWT

After successful Telegram verification, the API returns a Bearer access token.

The token payload contains:

```text
sub
telegramId
```

## Environment Variables

```text
JWT_SECRET
JWT_EXPIRES_IN
TELEGRAM_BOT_TOKEN
TELEGRAM_AUTH_MAX_AGE_SECONDS
```

## Commands

```zsh
npm run api:dev
npm run api:build
npm run lint
npm run typecheck
```
