import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { HeatCycleRecord } from '../domain/heat-cycle-record.js';
import {
  HEAT_CYCLES_REPOSITORY,
  type CreateHeatCycleInput,
  type HeatCyclesRepository,
} from '../domain/heat-cycles.repository.js';
import { calculateHeatCycleDuration } from './calculate-heat-cycle-duration.js';

export interface CreateCurrentUserHeatCycleInput {
  startDate: Date;
  endDate?: Date | null;
  predicted?: boolean;
  notes?: string | null;
}

@Injectable()
export class CreateCurrentUserHeatCycleUseCase {
  constructor(
    @Inject(HEAT_CYCLES_REPOSITORY)
    private readonly heatCyclesRepository: HeatCyclesRepository,
  ) {}

  async execute(
    userId: string,
    dogId: string,
    input: CreateCurrentUserHeatCycleInput,
  ): Promise<HeatCycleRecord> {
    const endDate = input.endDate ?? null;
    const createInput: CreateHeatCycleInput = {
      dogId,
      userId,
      startDate: input.startDate,
      endDate,
      duration: calculateHeatCycleDuration(input.startDate, endDate),
    };

    if (input.predicted !== undefined) {
      createInput.predicted = input.predicted;
    }

    if (input.notes !== undefined) {
      createInput.notes = input.notes;
    }

    const heatCycle = await this.heatCyclesRepository.create(createInput);

    if (!heatCycle) {
      throw new NotFoundException('Dog was not found.');
    }

    return heatCycle;
  }
}
