import { Injectable } from '@nestjs/common';

import type { HealthStatus } from '../domain/health-status.js';

@Injectable()
export class GetHealthStatusUseCase {
  execute(): HealthStatus {
    return {
      status: 'ok',
      service: 'api',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
