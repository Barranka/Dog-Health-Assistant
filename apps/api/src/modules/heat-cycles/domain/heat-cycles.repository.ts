import type { HeatCycleRecord } from './heat-cycle-record.js';

export const HEAT_CYCLES_REPOSITORY = Symbol('HEAT_CYCLES_REPOSITORY');

export interface CreateHeatCycleInput {
  dogId: string;
  userId: string;
  startDate: Date;
  endDate?: Date | null;
  duration?: number | null;
  predicted?: boolean;
  notes?: string | null;
}

export interface UpdateHeatCycleInput {
  startDate?: Date;
  endDate?: Date | null;
  duration?: number | null;
  predicted?: boolean;
  notes?: string | null;
}

export interface HeatCyclesRepository {
  create(input: CreateHeatCycleInput): Promise<HeatCycleRecord | null>;
  findManyByDogIdForUser(dogId: string, userId: string): Promise<HeatCycleRecord[]>;
  findByIdForUser(id: string, dogId: string, userId: string): Promise<HeatCycleRecord | null>;
  updateByIdForUser(
    id: string,
    dogId: string,
    userId: string,
    input: UpdateHeatCycleInput,
  ): Promise<HeatCycleRecord | null>;
  deleteByIdForUser(id: string, dogId: string, userId: string): Promise<boolean>;
}
