import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHeatCycleDto {
  @ApiProperty({ type: String, example: '2026-06-10' })
  @IsISO8601({ strict: true })
  startDate!: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2026-06-24' })
  @IsOptional()
  @IsISO8601({ strict: true })
  endDate?: string | null;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  predicted?: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
