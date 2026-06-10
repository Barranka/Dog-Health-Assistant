import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  HEALTH_EVENTS_REPOSITORY,
  type HealthEventsRepository,
} from '../domain/health-events.repository.js';

@Injectable()
export class DeleteCurrentUserHealthEventUseCase {
  constructor(
    @Inject(HEALTH_EVENTS_REPOSITORY)
    private readonly healthEventsRepository: HealthEventsRepository,
  ) {}

  async execute(userId: string, dogId: string, healthEventId: string): Promise<void> {
    const deleted = await this.healthEventsRepository.deleteByIdForUser(
      healthEventId,
      dogId,
      userId,
    );

    if (!deleted) {
      throw new NotFoundException('Health event was not found.');
    }
  }
}
