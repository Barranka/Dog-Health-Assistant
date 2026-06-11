import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnvironment } from './config/environment.validation.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { DogsModule } from './modules/dogs/dogs.module.js';
import { HeatCyclesModule } from './modules/heat-cycles/heat-cycles.module.js';
import { HealthEventsModule } from './modules/health-events/health-events.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env', '.env'],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    AuthModule,
    DogsModule,
    HeatCyclesModule,
    HealthEventsModule,
    HealthModule,
    NotificationsModule,
    UsersModule,
  ],
})
export class AppModule {}
