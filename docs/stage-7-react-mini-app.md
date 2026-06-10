# Stage 7: React Mini App

## Goal

Stage 7 creates the React Telegram Mini App foundation.

This stage focuses on the Mini App shell, navigation, Telegram WebApp integration, theme variables, and mobile-first layout.

Standalone browser mode will be expanded in Stage 8.

## Application

```text
apps/web
```

## Stack

```text
React
TypeScript
Vite
Telegram Mini App SDK package
React Query
React Router
TailwindCSS
Lucide React icons
```

## Routes

```text
/
/dogs
/heat-cycles
/calendar
/health
/symptoms
/knowledge
/settings
```

## Telegram Integration

The app reads Telegram WebApp data from:

```text
window.Telegram.WebApp
```

It calls:

```text
ready()
expand()
```

The UI uses Telegram theme variables such as:

```text
--tg-theme-bg-color
--tg-theme-text-color
--tg-theme-button-color
--tg-theme-secondary-bg-color
```

## Commands

```zsh
npm run web:dev
npm run web:build
npm run web:preview
npm run web:typecheck
```

## Local URLs

```text
http://localhost:5173
```

## Notes

API-backed CRUD and real data loading will be added in later stages.
