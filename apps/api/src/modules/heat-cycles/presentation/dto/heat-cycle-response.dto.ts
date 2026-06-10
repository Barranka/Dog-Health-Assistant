import { ApiProperty } from '@nestjs/swagger';

export class HeatCycleResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  dogId!: string;

  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiProperty({ type: Date, nullable: true })
  endDate!: Date | null;

  @ApiProperty({ type: Number, nullable: true })
  duration!: number | null;

  @ApiProperty({ enum: ['active', 'completed'], enumName: 'HeatCycleStatus' })
  status!: 'active' | 'completed';

  @ApiProperty({ type: Boolean })
  predicted!: boolean;

  @ApiProperty({ type: String, nullable: true })
  notes!: string | null;

  @ApiProperty({ type: Date })
  createdAt!: Date;
}
