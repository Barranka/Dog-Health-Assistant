import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  telegramId!: string;

  @ApiProperty({ nullable: true })
  firstName!: string | null;

  @ApiProperty({ nullable: true })
  username!: string | null;

  @ApiProperty()
  createdAt!: Date;
}
