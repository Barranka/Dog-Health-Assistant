import { Injectable } from '@nestjs/common';

import type { NotificationDeliveryRecord } from '../domain/notification-record.js';

@Injectable()
export class TelegramNotificationService {
  async sendNotification(notification: NotificationDeliveryRecord): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return false;
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: notification.telegramId,
        text: [notification.title, '', notification.message].join('\n'),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Telegram API error ${response.status}: ${errorText}`);
    }

    return true;
  }
}
