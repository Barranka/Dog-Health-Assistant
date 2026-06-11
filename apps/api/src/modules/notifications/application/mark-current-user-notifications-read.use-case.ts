import { Inject, Injectable } from '@nestjs/common';

import {
  NOTIFICATIONS_REPOSITORY,
  type NotificationsRepository,
} from '../domain/notifications.repository.js';

@Injectable()
export class MarkCurrentUserNotificationsReadUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  execute(userId: string): Promise<number> {
    return this.notificationsRepository.markAllReadForUser(userId);
  }
}
