# Stage 15: Notifications

## Goal

Add a notification system that works independently from Telegram, so users can still use the web app and see reminders even if Telegram delivery is unavailable.

## Implemented

- Added `Notification` as an in-app notification model.
- Added notification status: `unread` and `read`.
- Added notification types:
  - `health_event_reminder`
  - `heat_cycle_check`
  - `heat_cycle_forecast`
- Added API endpoints for the future notification bell:
  - `GET /api/notifications`
  - `GET /api/notifications/unread-count`
  - `PATCH /api/notifications/:id/read`
  - `PATCH /api/notifications/read-all`
- Added dev endpoint:
  - `POST /api/notifications/dev/run-daily-check`
- Added Telegram delivery as an optional channel.
- Added localized web notification bell dropdown.
- Added mobile-friendly dropdown sizing and scroll behavior.

## Daily Check

The scheduler is disabled by default in local development.

Environment variables:

```env
NOTIFICATIONS_SCHEDULER_ENABLED=false
NOTIFICATIONS_SCHEDULE_HOUR=9
NOTIFICATIONS_SCHEDULE_MINUTE=0
```

When enabled, the API process checks once per minute whether the configured time has come. At the configured time it creates due in-app notifications and attempts Telegram delivery.

## Current Rules

- Health events with `nextReminderDate` today create in-app notifications.
- Active heat cycles older than 21 days create a gentle "is the heat still active?" notification.
- Completed heat cycles create a next-heat forecast notification on the estimated next heat date.
- Telegram delivery failure does not delete the in-app notification.
