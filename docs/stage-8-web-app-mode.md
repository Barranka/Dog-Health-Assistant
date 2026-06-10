# Stage 8: Web App Mode

## Goal

Stage 8 adds the standalone Web App mode on top of the existing Telegram Mini App shell.

The mobile Telegram experience remains the primary layout. Browser and desktop widths now get an expanded application frame with a sidebar and wider content area.

## Architectural Decision

The app uses one React application for both modes:

```text
Telegram Mini App
Standalone Web App
```

Mode-specific behavior is handled by responsive layout:

```text
mobile/tablet: TopBar + BottomNavigation
desktop: DesktopSidebar + TopBar + wide content canvas
```

The route tree stays shared, so future features are implemented once and work in both modes.

## Files

```text
apps/web/src/presentation/app/AppLayout.tsx
apps/web/src/presentation/navigation/BottomNavigation.tsx
apps/web/src/presentation/navigation/DesktopSidebar.tsx
apps/web/src/presentation/navigation/TopBar.tsx
apps/web/src/presentation/navigation/navigation-items.ts
apps/web/src/presentation/pages/HomePage.tsx
apps/web/src/i18n/dictionaries.ts
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

## Web Layout

Desktop mode starts at Tailwind's `lg` breakpoint.

The desktop shell uses:

```text
280px sidebar
fluid content area
maximum app width of 1440px
maximum content width of 1040px
```

The mobile shell keeps:

```text
bottom navigation
safe-area padding
Telegram theme variables
mobile-first content spacing
```

## Commands

```zsh
npm run web:dev
npm run web:build
npm run web:typecheck
npm run lint
npm run format:check
```

## Local URL

```text
http://localhost:5173
```

## Responsive Checklist

Check the application at:

```text
320px
360px
375px
390px
414px
768px
1024px
1280px
1440px
```

Expected behavior:

```text
Mobile widths show BottomNavigation.
Desktop widths hide BottomNavigation.
Desktop widths show DesktopSidebar.
Content does not stretch beyond a comfortable reading width.
Telegram theme variables continue to drive colors.
All routes remain available in browser mode.
```

## Typical Issues

```text
If the sidebar does not appear, check that the viewport is at least the lg breakpoint.
If navigation labels are not translated, add the key to dictionaries.ts.
If a route is available on desktop but not mobile, check navigation-items.ts and BottomNavigation.tsx.
```

## Impact On Next Stages

Stage 9 can add real user data without splitting Telegram and Web App implementations.

Future CRUD screens can use the same route and component structure for both modes.
