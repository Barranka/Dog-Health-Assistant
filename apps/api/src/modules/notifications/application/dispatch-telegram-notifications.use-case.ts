import { Inject, Injectable } from '@nestjs/common';

import {
  NOTIFICATIONS_REPOSITORY,
  type NotificationsRepository,
} from '../domain/notifications.repository.js';
import { TelegramNotificationService } from './telegram-notification.service.js';

export interface DispatchTelegramNotificationsResult {
  sentCount: number;
  failedCount: number;
  skippedCount: number;
}

@Injectable()
export class DispatchTelegramNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
    @Inject(TelegramNotificationService)
    private readonly telegramNotificationService: TelegramNotificationService,
  ) {}

  async execute(before = new Date()): Promise<DispatchTelegramNotificationsResult> {
    const notifications = await this.notificationsRepository.findPendingTelegramDeliveries(before);
    let sentCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const notification of notifications) {
      try {
        const sent = await this.telegramNotificationService.sendNotification(notification);

        if (sent) {
          await this.notificationsRepository.markTelegramSent(notification.id, new Date());
          sentCount += 1;
        } else {
          skippedCount += 1;
        }
      } catch (error) {
        failedCount += 1;
        await this.notificationsRepository.markTelegramFailed(
          notification.id,
          error instanceof Error ? error.message : 'Unknown Telegram delivery error.',
        );
      }
    }

    return {
      sentCount,
      failedCount,
      skippedCount,
    };
  }
}
