import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { HeatCycleRecord } from '../domain/heat-cycle-record.js';
import type {
  CreateHeatCycleInput,
  HeatCyclesRepository,
  UpdateHeatCycleInput,
} from '../domain/heat-cycles.repository.js';

@Injectable()
export class PrismaHeatCyclesRepository implements HeatCyclesRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(input: CreateHeatCycleInput): Promise<HeatCycleRecord | null> {
    const dog = await this.prisma.dog.findFirst({
      where: {
        id: input.dogId,
        userId: input.userId,
      },
      select: {
        id: true,
      },
    });

    if (!dog) {
      return null;
    }

    const heatCycle = await this.prisma.heatCycle.create({
      data: this.toCreateData(input),
    });

    return this.toHeatCycleRecord(heatCycle);
  }

  async findManyByDogIdForUser(dogId: string, userId: string): Promise<HeatCycleRecord[]> {
    const heatCycles = await this.prisma.heatCycle.findMany({
      where: {
        dogId,
        dog: {
          userId,
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return heatCycles.map((heatCycle) => this.toHeatCycleRecord(heatCycle));
  }

  async findByIdForUser(
    id: string,
    dogId: string,
    userId: string,
  ): Promise<HeatCycleRecord | null> {
    const heatCycle = await this.prisma.heatCycle.findFirst({
      where: {
        id,
        dogId,
        dog: {
          userId,
        },
      },
    });

    return heatCycle ? this.toHeatCycleRecord(heatCycle) : null;
  }

  async updateByIdForUser(
    id: string,
    dogId: string,
    userId: string,
    input: UpdateHeatCycleInput,
  ): Promise<HeatCycleRecord | null> {
    const heatCycle = await this.prisma.heatCycle.updateManyAndReturn({
      where: {
        id,
        dogId,
        dog: {
          userId,
        },
      },
      data: input,
      limit: 1,
    });

    return heatCycle[0] ? this.toHeatCycleRecord(heatCycle[0]) : null;
  }

  async deleteByIdForUser(id: string, dogId: string, userId: string): Promise<boolean> {
    const result = await this.prisma.heatCycle.deleteMany({
      where: {
        id,
        dogId,
        dog: {
          userId,
        },
      },
    });

    return result.count > 0;
  }

  private toCreateData(input: CreateHeatCycleInput): Prisma.HeatCycleUncheckedCreateInput {
    const data: Prisma.HeatCycleUncheckedCreateInput = {
      dogId: input.dogId,
      startDate: input.startDate,
    };

    if (input.endDate !== undefined) {
      data.endDate = input.endDate;
    }

    if (input.duration !== undefined) {
      data.duration = input.duration;
    }

    if (input.predicted !== undefined) {
      data.predicted = input.predicted;
    }

    if (input.notes !== undefined) {
      data.notes = input.notes;
    }

    return data;
  }

  private toHeatCycleRecord(heatCycle: {
    id: string;
    dogId: string;
    startDate: Date;
    endDate: Date | null;
    duration: number | null;
    predicted: boolean;
    notes: string | null;
    createdAt: Date;
  }): HeatCycleRecord {
    return {
      id: heatCycle.id,
      dogId: heatCycle.dogId,
      startDate: heatCycle.startDate,
      endDate: heatCycle.endDate,
      duration: heatCycle.duration,
      status: heatCycle.endDate ? 'completed' : 'active',
      predicted: heatCycle.predicted,
      notes: heatCycle.notes,
      createdAt: heatCycle.createdAt,
    };
  }
}
