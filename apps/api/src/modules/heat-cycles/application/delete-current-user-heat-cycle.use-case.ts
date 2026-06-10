import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  HEAT_CYCLES_REPOSITORY,
  type HeatCyclesRepository,
} from '../domain/heat-cycles.repository.js';

@Injectable()
export class DeleteCurrentUserHeatCycleUseCase {
  constructor(
    @Inject(HEAT_CYCLES_REPOSITORY)
    private readonly heatCyclesRepository: HeatCyclesRepository,
  ) {}

  async execute(userId: string, dogId: string, heatCycleId: string): Promise<void> {
    const deleted = await this.heatCyclesRepository.deleteByIdForUser(heatCycleId, dogId, userId);

    if (!deleted) {
      throw new NotFoundException('Heat cycle was not found.');
    }
  }
}
