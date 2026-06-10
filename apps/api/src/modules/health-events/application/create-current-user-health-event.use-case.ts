import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { HealthEventRecord } from '../domain/health-event-record.js';
import type { HealthEventType } from '../domain/health-event-type.js';
import {
  HEALTH_EVENTS_REPOSITORY,
  type CreateHealthEventInput,
  type HealthEventsRepository,
} from '../domain/health-events.repository.js';

export interface CreateCurrentUserHealthEventInput {
  type: HealthEventType;
  title: string;
  eventDate: Date;
  nextReminderDate?: Date | null;
  notes?: string | null;
}

@Injectable()
export class CreateCurrentUserHealthEventUseCase {
  constructor(
    @Inject(HEALTH_EVENTS_REPOSITORY)
    private readonly healthEventsRepository: HealthEventsRepository,
  ) {}

  async execute(
    userId: string,
    dogId: string,
    input: CreateCurrentUserHealthEventInput,
  ): Promise<HealthEventRecord> {
    const createInput: CreateHealthEventInput = {
      dogId,
      userId,
      type: input.type,
      title: input.title,
      eventDate: input.eventDate,
    };

    if (input.nextReminderDate !== undefined) {
      createInput.nextReminderDate = input.nextReminderDate;
    }

    if (input.notes !== undefined) {
      createInput.notes = input.notes;
    }

    const healthEvent = await this.healthEventsRepository.create(createInput);

    if (!healthEvent) {
      throw new NotFoundException('Dog was not found.');
    }

    return healthEvent;
  }
}
