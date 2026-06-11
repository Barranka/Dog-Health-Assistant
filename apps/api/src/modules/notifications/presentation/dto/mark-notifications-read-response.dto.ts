import { ApiProperty } from '@nestjs/swagger';

export class MarkNotificationsReadResponseDto {
  @ApiProperty({ type: Number })
  updatedCount!: number;
}
