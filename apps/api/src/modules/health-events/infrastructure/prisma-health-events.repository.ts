import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { HealthEventRecord } from '../domain/health-event-record.js';
import type { HealthEventType } from '../domain/health-event-type.js';
import type {
  CreateHealthEventInput,
  HealthEventsRepository,
  UpdateHealthEventInput,
} from '../domain/health-events.repository.js';

@Injectable()
export class PrismaHealthEventsRepository implements HealthEventsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(input: CreateHealthEventInput): Promise<HealthEventRecord | null> {
    const dog = await this.prisma.dog.findFirst({
      where: {
        id: input.dogId,
        userId: input.userId,
      },
      select: {
        id: true,
      },
    });

    if (!dog) {
      return null;
    }

    const healthEvent = await this.prisma.healthEvent.create({
      data: this.toCreateData(input),
    });

    return this.toHealthEventRecord(healthEvent);
  }

  async findManyByDogIdForUser(dogId: string, userId: string): Promise<HealthEventRecord[]> {
    const healthEvents = await this.prisma.healthEvent.findMany({
      where: {
        dogId,
        dog: {
          userId,
        },
      },
      orderBy: {
        eventDate: 'desc',
      },
    });

    return healthEvents.map((healthEvent) => this.toHealthEventRecord(healthEvent));
  }

  async findByIdForUser(
    id: string,
    dogId: string,
    userId: string,
  ): Promise<HealthEventRecord | null> {
    const healthEvent = await this.prisma.healthEvent.findFirst({
      where: {
        id,
        dogId,
        dog: {
          userId,
        },
      },
    });

    return healthEvent ? this.toHealthEventRecord(healthEvent) : null;
  }

  async updateByIdForUser(
    id: string,
    dogId: string,
    userId: string,
    input: UpdateHealthEventInput,
  ): Promise<HealthEventRecord | null> {
    const healthEvents = await this.prisma.healthEvent.updateManyAndReturn({
      where: {
        id,
        dogId,
        dog: {
          userId,
        },
      },
      data: input,
      limit: 1,
    });

    return healthEvents[0] ? this.toHealthEventRecord(healthEvents[0]) : null;
  }

  async deleteByIdForUser(id: string, dogId: string, userId: string): Promise<boolean> {
    const result = await this.prisma.healthEvent.deleteMany({
      where: {
        id,
        dogId,
        dog: {
          userId,
        },
      },
    });

    return result.count > 0;
  }

  private toCreateData(input: CreateHealthEventInput): Prisma.HealthEventUncheckedCreateInput {
    const data: Prisma.HealthEventUncheckedCreateInput = {
      dogId: input.dogId,
      type: input.type,
      title: input.title,
      eventDate: input.eventDate,
    };

    if (input.nextReminderDate !== undefined) {
      data.nextReminderDate = input.nextReminderDate;
    }

    if (input.notes !== undefined) {
      data.notes = input.notes;
    }

    return data;
  }

  private toHealthEventRecord(healthEvent: {
    id: string;
    dogId: string;
    type: HealthEventType;
    title: string;
    eventDate: Date;
    nextReminderDate: Date | null;
    notes: string | null;
    createdAt: Date;
  }): HealthEventRecord {
    return {
      id: healthEvent.id,
      dogId: healthEvent.dogId,
      type: healthEvent.type,
      title: healthEvent.title,
      eventDate: healthEvent.eventDate,
      nextReminderDate: healthEvent.nextReminderDate,
      notes: healthEvent.notes,
      createdAt: healthEvent.createdAt,
    };
  }
}
