import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { NotificationRecord } from '../domain/notification-record.js';
import {
  NOTIFICATIONS_REPOSITORY,
  type NotificationsRepository,
} from '../domain/notifications.repository.js';

@Injectable()
export class MarkCurrentUserNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<NotificationRecord> {
    const notification = await this.notificationsRepository.markReadByIdForUser(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new NotFoundException('Notification was not found.');
    }

    return notification;
  }
}
