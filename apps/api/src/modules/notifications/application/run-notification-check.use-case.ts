import { Inject, Injectable } from '@nestjs/common';

import { DispatchTelegramNotificationsUseCase } from './dispatch-telegram-notifications.use-case.js';
import { GenerateDueNotificationsUseCase } from './generate-due-notifications.use-case.js';
import { getUtcDayRange } from './notification-schedule.js';

export interface RunNotificationCheckResult {
  createdCount: number;
  telegramSentCount: number;
  telegramFailedCount: number;
  telegramSkippedCount: number;
}

@Injectable()
export class RunNotificationCheckUseCase {
  constructor(
    @Inject(GenerateDueNotificationsUseCase)
    private readonly generateDueNotificationsUseCase: GenerateDueNotificationsUseCase,
    @Inject(DispatchTelegramNotificationsUseCase)
    private readonly dispatchTelegramNotificationsUseCase: DispatchTelegramNotificationsUseCase,
  ) {}

  async execute(now = new Date(), userId?: string): Promise<RunNotificationCheckResult> {
    const generated = await this.generateDueNotificationsUseCase.execute(now, userId);
    const dayRange = getUtcDayRange(now);
    const telegram = await this.dispatchTelegramNotificationsUseCase.execute(dayRange.end);

    return {
      createdCount: generated.createdCount,
      telegramSentCount: telegram.sentCount,
      telegramFailedCount: telegram.failedCount,
      telegramSkippedCount: telegram.skippedCount,
    };
  }
}
