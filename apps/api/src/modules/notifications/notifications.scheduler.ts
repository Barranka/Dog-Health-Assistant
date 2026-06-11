import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { RunNotificationCheckUseCase } from './application/run-notification-check.use-case.js';

@Injectable()
export class NotificationsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsScheduler.name);
  private interval?: NodeJS.Timeout;
  private lastRunDateKey?: string;

  constructor(
    @Inject(RunNotificationCheckUseCase)
    private readonly runNotificationCheckUseCase: RunNotificationCheckUseCase,
  ) {}

  onModuleInit(): void {
    if (process.env.NOTIFICATIONS_SCHEDULER_ENABLED !== 'true') {
      return;
    }

    this.interval = setInterval(() => {
      void this.tick();
    }, 60_000);
    void this.tick();
  }

  onModuleDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async tick(): Promise<void> {
    const now = new Date();

    if (!this.shouldRun(now)) {
      return;
    }

    this.lastRunDateKey = this.getDateKey(now);

    try {
      const result = await this.runNotificationCheckUseCase.execute(now);

      this.logger.log(
        `Notification check completed: created=${result.createdCount}, telegramSent=${result.telegramSentCount}, telegramFailed=${result.telegramFailedCount}, telegramSkipped=${result.telegramSkippedCount}`,
      );
    } catch (error) {
      this.logger.error('Notification check failed.', error);
    }
  }

  private shouldRun(now: Date): boolean {
    const hour = this.getNumberFromEnv('NOTIFICATIONS_SCHEDULE_HOUR', 9);
    const minute = this.getNumberFromEnv('NOTIFICATIONS_SCHEDULE_MINUTE', 0);

    return (
      now.getHours() === hour &&
      now.getMinutes() === minute &&
      this.lastRunDateKey !== this.getDateKey(now)
    );
  }

  private getDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getNumberFromEnv(name: string, fallback: number): number {
    const rawValue = process.env[name];

    if (!rawValue) {
      return fallback;
    }

    const value = Number.parseInt(rawValue, 10);

    return Number.isNaN(value) ? fallback : value;
  }
}
