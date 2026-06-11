CREATE TYPE "NotificationType" AS ENUM (
  'health_event_reminder',
  'heat_cycle_check',
  'heat_cycle_forecast'
);

CREATE TYPE "NotificationStatus" AS ENUM (
  'unread',
  'read'
);

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "dogId" TEXT,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'unread',
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "readAt" TIMESTAMP(3),
  "telegramSentAt" TIMESTAMP(3),
  "telegramError" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "notifications_userId_type_relatedEntityType_relatedEntityId_scheduledAt_key"
  ON "notifications"("userId", "type", "relatedEntityType", "relatedEntityId", "scheduledAt");

CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX "notifications_dogId_idx" ON "notifications"("dogId");
CREATE INDEX "notifications_status_idx" ON "notifications"("status");
CREATE INDEX "notifications_scheduledAt_idx" ON "notifications"("scheduledAt");
CREATE INDEX "notifications_telegramSentAt_idx" ON "notifications"("telegramSentAt");

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_dogId_fkey"
  FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
