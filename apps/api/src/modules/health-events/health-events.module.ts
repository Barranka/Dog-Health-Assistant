import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { CreateCurrentUserHealthEventUseCase } from './application/create-current-user-health-event.use-case.js';
import { DeleteCurrentUserHealthEventUseCase } from './application/delete-current-user-health-event.use-case.js';
import { GetCurrentUserHealthEventUseCase } from './application/get-current-user-health-event.use-case.js';
import { ListCurrentUserHealthEventsUseCase } from './application/list-current-user-health-events.use-case.js';
import { UpdateCurrentUserHealthEventUseCase } from './application/update-current-user-health-event.use-case.js';
import { HEALTH_EVENTS_REPOSITORY } from './domain/health-events.repository.js';
import { PrismaHealthEventsRepository } from './infrastructure/prisma-health-events.repository.js';
import { HealthEventsController } from './presentation/health-events.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [HealthEventsController],
  providers: [
    CreateCurrentUserHealthEventUseCase,
    DeleteCurrentUserHealthEventUseCase,
    GetCurrentUserHealthEventUseCase,
    ListCurrentUserHealthEventsUseCase,
    UpdateCurrentUserHealthEventUseCase,
    {
      provide: HEALTH_EVENTS_REPOSITORY,
      useClass: PrismaHealthEventsRepository,
    },
  ],
})
export class HealthEventsModule {}
