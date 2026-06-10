import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TelegramLoginDto {
  @ApiProperty({
    type: String,
    description: 'Telegram user id from Telegram Login widget.',
  })
  @Transform(({ value }) => String(value))
  @IsString()
  @MinLength(1)
  id!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Telegram first name from Telegram Login widget.',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Telegram username from Telegram Login widget.',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    type: Number,
    description: 'Telegram auth_date from Telegram Login widget.',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  auth_date!: number;

  @ApiProperty({
    type: String,
    description: 'Telegram HMAC hash from Telegram Login widget.',
  })
  @IsString()
  @MinLength(1)
  hash!: string;
}
