import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { CreateCurrentUserHeatCycleUseCase } from './application/create-current-user-heat-cycle.use-case.js';
import { DeleteCurrentUserHeatCycleUseCase } from './application/delete-current-user-heat-cycle.use-case.js';
import { GetCurrentUserHeatCycleUseCase } from './application/get-current-user-heat-cycle.use-case.js';
import { ListCurrentUserHeatCyclesUseCase } from './application/list-current-user-heat-cycles.use-case.js';
import { UpdateCurrentUserHeatCycleUseCase } from './application/update-current-user-heat-cycle.use-case.js';
import { HEAT_CYCLES_REPOSITORY } from './domain/heat-cycles.repository.js';
import { PrismaHeatCyclesRepository } from './infrastructure/prisma-heat-cycles.repository.js';
import { HeatCyclesController } from './presentation/heat-cycles.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [HeatCyclesController],
  providers: [
    CreateCurrentUserHeatCycleUseCase,
    DeleteCurrentUserHeatCycleUseCase,
    GetCurrentUserHeatCycleUseCase,
    ListCurrentUserHeatCyclesUseCase,
    UpdateCurrentUserHeatCycleUseCase,
    {
      provide: HEAT_CYCLES_REPOSITORY,
      useClass: PrismaHeatCyclesRepository,
    },
  ],
})
export class HeatCyclesModule {}
