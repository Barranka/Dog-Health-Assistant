import type { HealthEventRecord } from './health-event-record.js';
import type { HealthEventType } from './health-event-type.js';

export const HEALTH_EVENTS_REPOSITORY = Symbol('HEALTH_EVENTS_REPOSITORY');

export interface CreateHealthEventInput {
  dogId: string;
  userId: string;
  type: HealthEventType;
  title: string;
  eventDate: Date;
  nextReminderDate?: Date | null;
  notes?: string | null;
}

export interface UpdateHealthEventInput {
  type?: HealthEventType;
  title?: string;
  eventDate?: Date;
  nextReminderDate?: Date | null;
  notes?: string | null;
}

export interface HealthEventsRepository {
  create(input: CreateHealthEventInput): Promise<HealthEventRecord | null>;
  findManyByDogIdForUser(dogId: string, userId: string): Promise<HealthEventRecord[]>;
  findByIdForUser(id: string, dogId: string, userId: string): Promise<HealthEventRecord | null>;
  updateByIdForUser(
    id: string,
    dogId: string,
    userId: string,
    input: UpdateHealthEventInput,
  ): Promise<HealthEventRecord | null>;
  deleteByIdForUser(id: string, dogId: string, userId: string): Promise<boolean>;
}
