import { ApiProperty } from '@nestjs/swagger';

import { dogSexValues, type DogSex } from '../../domain/dog-sex.js';

export class DogResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  userId!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  breed!: string | null;

  @ApiProperty({ enum: dogSexValues, enumName: 'DogSex' })
  sex!: DogSex;

  @ApiProperty({ type: Date, nullable: true })
  birthDate!: Date | null;

  @ApiProperty({ type: Number, nullable: true })
  weight!: number | null;

  @ApiProperty({ type: String, nullable: true })
  color!: string | null;

  @ApiProperty({ type: Boolean })
  sterilized!: boolean;

  @ApiProperty({ type: String, nullable: true })
  notes!: string | null;

  @ApiProperty({ type: Date })
  createdAt!: Date;
}
