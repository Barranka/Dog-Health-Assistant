import { Inject, Injectable } from '@nestjs/common';

import type { NotificationRecord } from '../domain/notification-record.js';
import {
  NOTIFICATIONS_REPOSITORY,
  type NotificationsRepository,
} from '../domain/notifications.repository.js';

@Injectable()
export class ListCurrentUserNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  execute(userId: string): Promise<NotificationRecord[]> {
    return this.notificationsRepository.findManyByUserId(userId);
  }
}
