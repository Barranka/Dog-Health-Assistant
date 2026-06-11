import { ApiProperty } from '@nestjs/swagger';

export class RunNotificationCheckResponseDto {
  @ApiProperty({ type: Number })
  createdCount!: number;

  @ApiProperty({ type: Number })
  telegramSentCount!: number;

  @ApiProperty({ type: Number })
  telegramFailedCount!: number;

  @ApiProperty({ type: Number })
  telegramSkippedCount!: number;
}
