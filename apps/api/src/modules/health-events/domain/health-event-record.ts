import type { HealthEventType } from './health-event-type.js';

export interface HealthEventRecord {
  id: string;
  dogId: string;
  type: HealthEventType;
  title: string;
  eventDate: Date;
  nextReminderDate: Date | null;
  notes: string | null;
  createdAt: Date;
}
