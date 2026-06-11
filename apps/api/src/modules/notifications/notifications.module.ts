import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { CountCurrentUserUnreadNotificationsUseCase } from './application/count-current-user-unread-notifications.use-case.js';
import { DispatchTelegramNotificationsUseCase } from './application/dispatch-telegram-notifications.use-case.js';
import { GenerateDueNotificationsUseCase } from './application/generate-due-notifications.use-case.js';
import { ListCurrentUserNotificationsUseCase } from './application/list-current-user-notifications.use-case.js';
import { MarkCurrentUserNotificationReadUseCase } from './application/mark-current-user-notification-read.use-case.js';
import { MarkCurrentUserNotificationsReadUseCase } from './application/mark-current-user-notifications-read.use-case.js';
import { RunNotificationCheckUseCase } from './application/run-notification-check.use-case.js';
import { TelegramNotificationService } from './application/telegram-notification.service.js';
import { NOTIFICATIONS_REPOSITORY } from './domain/notifications.repository.js';
import { PrismaNotificationsRepository } from './infrastructure/prisma-notifications.repository.js';
import { NotificationsScheduler } from './notifications.scheduler.js';
import { NotificationsController } from './presentation/notifications.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [NotificationsController],
  providers: [
    CountCurrentUserUnreadNotificationsUseCase,
    DispatchTelegramNotificationsUseCase,
    GenerateDueNotificationsUseCase,
    ListCurrentUserNotificationsUseCase,
    MarkCurrentUserNotificationReadUseCase,
    MarkCurrentUserNotificationsReadUseCase,
    NotificationsScheduler,
    RunNotificationCheckUseCase,
    TelegramNotificationService,
    {
      provide: NOTIFICATIONS_REPOSITORY,
      useClass: PrismaNotificationsRepository,
    },
  ],
})
export class NotificationsModule {}
