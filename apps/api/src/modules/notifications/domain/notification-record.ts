import type { NotificationStatus, NotificationType } from '@prisma/client';

export interface NotificationRecord {
  id: string;
  userId: string;
  dogId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  scheduledAt: Date;
  readAt: Date | null;
  telegramSentAt: Date | null;
  telegramError: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDeliveryRecord extends NotificationRecord {
  telegramId: string;
}
