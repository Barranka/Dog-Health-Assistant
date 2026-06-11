import { ApiProperty } from '@nestjs/swagger';

export class UnreadNotificationsCountResponseDto {
  @ApiProperty({ type: Number })
  unreadCount!: number;
}
