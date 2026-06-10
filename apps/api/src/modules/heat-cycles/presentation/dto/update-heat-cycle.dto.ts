import { PartialType } from '@nestjs/swagger';

import { CreateHeatCycleDto } from './create-heat-cycle.dto.js';

export class UpdateHeatCycleDto extends PartialType(CreateHeatCycleDto) {}
