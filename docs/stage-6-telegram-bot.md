# Stage 6: Telegram Bot

## Goal

Stage 6 adds the Telegram Bot application.

The bot is responsible for opening the Telegram Mini App and providing basic navigation commands.

Notification delivery will be implemented in Stage 15.

## Application

```text
apps/bot
```

## Commands

```text
/start
/events
/help
```

## Mini App Buttons

The bot provides Web App buttons for:

```text
Home
Dogs
Calendar
Health
Knowledge
```

The buttons use `APP_URL` from the environment.

## Environment Variables

```text
TELEGRAM_BOT_TOKEN
APP_URL
API_BASE_URL
```

`TELEGRAM_BOT_TOKEN` is created with BotFather.

`APP_URL` must be an HTTPS URL for Telegram Mini App usage in production.

## Commands

Validate configuration without connecting to Telegram:

```zsh
npm run bot:check
```

Run in development mode:

```zsh
npm run bot:dev
```

Build:

```zsh
npm run bot:build
```

Run compiled bot:

```zsh
npm run bot:start
```
