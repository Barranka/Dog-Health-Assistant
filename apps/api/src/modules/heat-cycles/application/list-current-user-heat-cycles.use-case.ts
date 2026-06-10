import { Inject, Injectable } from '@nestjs/common';

import type { HeatCycleRecord } from '../domain/heat-cycle-record.js';
import {
  HEAT_CYCLES_REPOSITORY,
  type HeatCyclesRepository,
} from '../domain/heat-cycles.repository.js';

@Injectable()
export class ListCurrentUserHeatCyclesUseCase {
  constructor(
    @Inject(HEAT_CYCLES_REPOSITORY)
    private readonly heatCyclesRepository: HeatCyclesRepository,
  ) {}

  execute(userId: string, dogId: string): Promise<HeatCycleRecord[]> {
    return this.heatCyclesRepository.findManyByDogIdForUser(dogId, userId);
  }
}
