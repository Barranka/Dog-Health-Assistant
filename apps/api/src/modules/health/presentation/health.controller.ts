import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetHealthStatusUseCase } from '../application/get-health-status.use-case.js';
import type { HealthStatus } from '../domain/health-status.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly getHealthStatusUseCase: GetHealthStatusUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  @ApiOkResponse({
    description: 'API is running.',
    schema: {
      example: {
        status: 'ok',
        service: 'api',
        uptime: 12.345,
        timestamp: '2026-06-09T12:00:00.000Z',
      },
    },
  })
  getHealth(): HealthStatus {
    return this.getHealthStatusUseCase.execute();
  }
}
