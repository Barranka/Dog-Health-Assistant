import { Inject, Injectable } from '@nestjs/common';

import type { HealthEventRecord } from '../domain/health-event-record.js';
import {
  HEALTH_EVENTS_REPOSITORY,
  type HealthEventsRepository,
} from '../domain/health-events.repository.js';

@Injectable()
export class ListCurrentUserHealthEventsUseCase {
  constructor(
    @Inject(HEALTH_EVENTS_REPOSITORY)
    private readonly healthEventsRepository: HealthEventsRepository,
  ) {}

  execute(userId: string, dogId: string): Promise<HealthEventRecord[]> {
    return this.healthEventsRepository.findManyByDogIdForUser(dogId, userId);
  }
}
