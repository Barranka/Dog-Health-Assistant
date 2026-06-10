import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { dogSexValues, type DogSex } from '../../domain/dog-sex.js';

export class CreateDogDto {
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string | null;

  @ApiProperty({ enum: dogSexValues, enumName: 'DogSex' })
  @IsEnum(dogSexValues)
  sex!: DogSex;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2022-05-15' })
  @IsOptional()
  @IsISO8601({ strict: true })
  birthDate?: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 12.4 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999.99)
  weight?: number | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  color?: string | null;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  sterilized?: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
