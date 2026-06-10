import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { HealthEventRecord } from '../domain/health-event-record.js';
import type { HealthEventType } from '../domain/health-event-type.js';
import {
  HEALTH_EVENTS_REPOSITORY,
  type HealthEventsRepository,
  type UpdateHealthEventInput,
} from '../domain/health-events.repository.js';

export interface UpdateCurrentUserHealthEventInput {
  type?: HealthEventType;
  title?: string;
  eventDate?: Date;
  nextReminderDate?: Date | null;
  notes?: string | null;
}

@Injectable()
export class UpdateCurrentUserHealthEventUseCase {
  constructor(
    @Inject(HEALTH_EVENTS_REPOSITORY)
    private readonly healthEventsRepository: HealthEventsRepository,
  ) {}

  async execute(
    userId: string,
    dogId: string,
    healthEventId: string,
    input: UpdateCurrentUserHealthEventInput,
  ): Promise<HealthEventRecord> {
    const updateInput: UpdateHealthEventInput = {};

    if (input.type !== undefined) {
      updateInput.type = input.type;
    }

    if (input.title !== undefined) {
      updateInput.title = input.title;
    }

    if (input.eventDate !== undefined) {
      updateInput.eventDate = input.eventDate;
    }

    if (input.nextReminderDate !== undefined) {
      updateInput.nextReminderDate = input.nextReminderDate;
    }

    if (input.notes !== undefined) {
      updateInput.notes = input.notes;
    }

    const healthEvent = await this.healthEventsRepository.updateByIdForUser(
      healthEventId,
      dogId,
      userId,
      updateInput,
    );

    if (!healthEvent) {
      throw new NotFoundException('Health event was not found.');
    }

    return healthEvent;
  }
}
