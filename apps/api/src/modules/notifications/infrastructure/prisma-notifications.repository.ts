import { Inject, Injectable } from '@nestjs/common';
import { Prisma, type NotificationStatus, type NotificationType } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type {
  NotificationDeliveryRecord,
  NotificationRecord,
} from '../domain/notification-record.js';
import type {
  CreateNotificationInput,
  NotificationsRepository,
} from '../domain/notifications.repository.js';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createManyIfNotExists(inputs: CreateNotificationInput[]): Promise<number> {
    let createdCount = 0;

    for (const input of inputs) {
      const where = {
        userId_type_relatedEntityType_relatedEntityId_scheduledAt: {
          userId: input.userId,
          type: input.type,
          relatedEntityType: input.relatedEntityType ?? '',
          relatedEntityId: input.relatedEntityId ?? '',
          scheduledAt: input.scheduledAt,
        },
      };
      const existingNotification = await this.prisma.notification.findUnique({
        where,
      });

      if (existingNotification) {
        continue;
      }

      await this.prisma.notification.create({
        data: this.toCreateData(input),
      });
      createdCount += 1;
    }

    return createdCount;
  }

  async findManyByUserId(userId: string): Promise<NotificationRecord[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          scheduledAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return notifications.map((notification) => this.toNotificationRecord(notification));
  }

  countUnreadByUserId(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        status: 'unread',
      },
    });
  }

  async markReadByIdForUser(id: string, userId: string): Promise<NotificationRecord | null> {
    const now = new Date();
    const notifications = await this.prisma.notification.updateManyAndReturn({
      where: {
        id,
        userId,
      },
      data: {
        status: 'read',
        readAt: now,
      },
      limit: 1,
    });

    return notifications[0] ? this.toNotificationRecord(notifications[0]) : null;
  }

  async markAllReadForUser(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        status: 'unread',
      },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });

    return result.count;
  }

  async findPendingTelegramDeliveries(before: Date): Promise<NotificationDeliveryRecord[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        scheduledAt: {
          lt: before,
        },
        telegramSentAt: null,
      },
      include: {
        user: {
          select: {
            telegramId: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return notifications.map((notification) => ({
      ...this.toNotificationRecord(notification),
      telegramId: notification.user.telegramId,
    }));
  }

  async markTelegramSent(id: string, sentAt: Date): Promise<void> {
    await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        telegramSentAt: sentAt,
        telegramError: null,
      },
    });
  }

  async markTelegramFailed(id: string, error: string): Promise<void> {
    await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        telegramError: error,
      },
    });
  }

  private toCreateData(input: CreateNotificationInput): Prisma.NotificationUncheckedCreateInput {
    return {
      userId: input.userId,
      dogId: input.dogId ?? null,
      type: input.type,
      title: input.title,
      message: input.message,
      scheduledAt: input.scheduledAt,
      relatedEntityType: input.relatedEntityType ?? '',
      relatedEntityId: input.relatedEntityId ?? '',
    };
  }

  private toNotificationRecord(notification: {
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
  }): NotificationRecord {
    return {
      id: notification.id,
      userId: notification.userId,
      dogId: notification.dogId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      status: notification.status,
      scheduledAt: notification.scheduledAt,
      readAt: notification.readAt,
      telegramSentAt: notification.telegramSentAt,
      telegramError: notification.telegramError,
      relatedEntityType: notification.relatedEntityType,
      relatedEntityId: notification.relatedEntityId,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
