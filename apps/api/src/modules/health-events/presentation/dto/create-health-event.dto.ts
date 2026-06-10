import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

import { editableHealthEventTypes, type HealthEventType } from '../../domain/health-event-type.js';

export class CreateHealthEventDto {
  @ApiProperty({ enum: editableHealthEventTypes, enumName: 'EditableHealthEventType' })
  @IsEnum(editableHealthEventTypes)
  type!: HealthEventType;

  @ApiProperty({ type: String, example: 'Annual vaccination' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ type: String, example: '2026-06-10' })
  @IsISO8601({ strict: true })
  eventDate!: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2027-06-10' })
  @IsOptional()
  @IsISO8601({ strict: true })
  nextReminderDate?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
