import type { NotificationType } from '@prisma/client';

import type { NotificationDeliveryRecord, NotificationRecord } from './notification-record.js';

export const NOTIFICATIONS_REPOSITORY = Symbol('NOTIFICATIONS_REPOSITORY');

export interface CreateNotificationInput {
  userId: string;
  dogId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  scheduledAt: Date;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export interface NotificationsRepository {
  createManyIfNotExists(inputs: CreateNotificationInput[]): Promise<number>;
  findManyByUserId(userId: string): Promise<NotificationRecord[]>;
  countUnreadByUserId(userId: string): Promise<number>;
  markReadByIdForUser(id: string, userId: string): Promise<NotificationRecord | null>;
  markAllReadForUser(userId: string): Promise<number>;
  findPendingTelegramDeliveries(before: Date): Promise<NotificationDeliveryRecord[]>;
  markTelegramSent(id: string, sentAt: Date): Promise<void>;
  markTelegramFailed(id: string, error: string): Promise<void>;
}
