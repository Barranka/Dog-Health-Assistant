import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TelegramLoginDto {
  @ApiProperty({
    description: 'Telegram user id from Telegram Login widget.',
  })
  @Transform(({ value }) => String(value))
  @IsString()
  @MinLength(1)
  id!: string;

  @ApiPropertyOptional({
    description: 'Telegram first name from Telegram Login widget.',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Telegram username from Telegram Login widget.',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Telegram auth_date from Telegram Login widget.',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  auth_date!: number;

  @ApiProperty({
    description: 'Telegram HMAC hash from Telegram Login widget.',
  })
  @IsString()
  @MinLength(1)
  hash!: string;
}
