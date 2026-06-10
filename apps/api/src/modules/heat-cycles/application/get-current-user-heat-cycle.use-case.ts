import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { HeatCycleRecord } from '../domain/heat-cycle-record.js';
import {
  HEAT_CYCLES_REPOSITORY,
  type HeatCyclesRepository,
} from '../domain/heat-cycles.repository.js';

@Injectable()
export class GetCurrentUserHeatCycleUseCase {
  constructor(
    @Inject(HEAT_CYCLES_REPOSITORY)
    private readonly heatCyclesRepository: HeatCyclesRepository,
  ) {}

  async execute(userId: string, dogId: string, heatCycleId: string): Promise<HeatCycleRecord> {
    const heatCycle = await this.heatCyclesRepository.findByIdForUser(heatCycleId, dogId, userId);

    if (!heatCycle) {
      throw new NotFoundException('Heat cycle was not found.');
    }

    return heatCycle;
  }
}
