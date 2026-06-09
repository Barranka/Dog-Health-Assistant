import { Module } from '@nestjs/common';

import { GetHealthStatusUseCase } from './application/get-health-status.use-case.js';
import { HealthController } from './presentation/health.controller.js';

@Module({
  controllers: [HealthController],
  providers: [GetHealthStatusUseCase],
})
export class HealthModule {}
