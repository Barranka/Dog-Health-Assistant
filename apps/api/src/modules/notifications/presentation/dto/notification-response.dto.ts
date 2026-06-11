import { ApiProperty } from '@nestjs/swagger';
import type { NotificationStatus, NotificationType } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  userId!: string;

  @ApiProperty({ type: String, nullable: true })
  dogId!: string | null;

  @ApiProperty({
    enum: ['health_event_reminder', 'heat_cycle_check', 'heat_cycle_forecast'],
    enumName: 'NotificationType',
  })
  type!: NotificationType;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String })
  message!: string;

  @ApiProperty({ enum: ['unread', 'read'], enumName: 'NotificationStatus' })
  status!: NotificationStatus;

  @ApiProperty({ type: Date })
  scheduledAt!: Date;

  @ApiProperty({ type: Date, nullable: true })
  readAt!: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  telegramSentAt!: Date | null;

  @ApiProperty({ type: String, nullable: true })
  telegramError!: string | null;

  @ApiProperty({ type: String, nullable: true })
  relatedEntityType!: string | null;

  @ApiProperty({ type: String, nullable: true })
  relatedEntityId!: string | null;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
