import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { HeatCycleRecord } from '../domain/heat-cycle-record.js';
import {
  HEAT_CYCLES_REPOSITORY,
  type HeatCyclesRepository,
  type UpdateHeatCycleInput,
} from '../domain/heat-cycles.repository.js';
import { calculateHeatCycleDuration } from './calculate-heat-cycle-duration.js';

export interface UpdateCurrentUserHeatCycleInput {
  startDate?: Date;
  endDate?: Date | null;
  predicted?: boolean;
  notes?: string | null;
}

@Injectable()
export class UpdateCurrentUserHeatCycleUseCase {
  constructor(
    @Inject(HEAT_CYCLES_REPOSITORY)
    private readonly heatCyclesRepository: HeatCyclesRepository,
  ) {}

  async execute(
    userId: string,
    dogId: string,
    heatCycleId: string,
    input: UpdateCurrentUserHeatCycleInput,
  ): Promise<HeatCycleRecord> {
    const existingHeatCycle = await this.heatCyclesRepository.findByIdForUser(
      heatCycleId,
      dogId,
      userId,
    );

    if (!existingHeatCycle) {
      throw new NotFoundException('Heat cycle was not found.');
    }

    const startDate = input.startDate ?? existingHeatCycle.startDate;
    const endDate = input.endDate !== undefined ? input.endDate : existingHeatCycle.endDate;
    const updateInput: UpdateHeatCycleInput = {
      duration: calculateHeatCycleDuration(startDate, endDate),
    };

    if (input.startDate !== undefined) {
      updateInput.startDate = input.startDate;
    }

    if (input.endDate !== undefined) {
      updateInput.endDate = input.endDate;
    }

    if (input.predicted !== undefined) {
      updateInput.predicted = input.predicted;
    }

    if (input.notes !== undefined) {
      updateInput.notes = input.notes;
    }

    const heatCycle = await this.heatCyclesRepository.updateByIdForUser(
      heatCycleId,
      dogId,
      userId,
      updateInput,
    );

    if (!heatCycle) {
      throw new NotFoundException('Heat cycle was not found.');
    }

    return heatCycle;
  }
}
