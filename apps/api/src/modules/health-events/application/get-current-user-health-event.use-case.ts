import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { HealthEventRecord } from '../domain/health-event-record.js';
import {
  HEALTH_EVENTS_REPOSITORY,
  type HealthEventsRepository,
} from '../domain/health-events.repository.js';

@Injectable()
export class GetCurrentUserHealthEventUseCase {
  constructor(
    @Inject(HEALTH_EVENTS_REPOSITORY)
    private readonly healthEventsRepository: HealthEventsRepository,
  ) {}

  async execute(userId: string, dogId: string, healthEventId: string): Promise<HealthEventRecord> {
    const healthEvent = await this.healthEventsRepository.findByIdForUser(
      healthEventId,
      dogId,
      userId,
    );

    if (!healthEvent) {
      throw new NotFoundException('Health event was not found.');
    }

    return healthEvent;
  }
}
