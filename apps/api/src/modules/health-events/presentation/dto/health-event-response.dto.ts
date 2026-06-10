import { ApiProperty } from '@nestjs/swagger';

import { healthEventTypes, type HealthEventType } from '../../domain/health-event-type.js';

export class HealthEventResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  dogId!: string;

  @ApiProperty({ enum: healthEventTypes, enumName: 'HealthEventType' })
  type!: HealthEventType;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: Date })
  eventDate!: Date;

  @ApiProperty({ type: Date, nullable: true })
  nextReminderDate!: Date | null;

  @ApiProperty({ type: String, nullable: true })
  notes!: string | null;

  @ApiProperty({ type: Date })
  createdAt!: Date;
}
