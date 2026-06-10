import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class TelegramMiniAppLoginDto {
  @ApiProperty({
    type: String,
    description: 'Raw Telegram WebApp initData string.',
  })
  @IsString()
  @MinLength(1)
  initData!: string;
}
