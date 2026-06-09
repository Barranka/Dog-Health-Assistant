import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthTokenService } from './application/auth-token.service.js';
import { GetCurrentUserUseCase } from './application/get-current-user.use-case.js';
import { LoginWithTelegramLoginUseCase } from './application/login-with-telegram-login.use-case.js';
import { LoginWithTelegramMiniAppUseCase } from './application/login-with-telegram-mini-app.use-case.js';
import { TelegramAuthService } from './application/telegram-auth.service.js';
import { USER_REPOSITORY } from './domain/user.repository.js';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.js';
import { AuthController } from './presentation/auth.controller.js';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard.js';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthTokenService,
    GetCurrentUserUseCase,
    JwtAuthGuard,
    LoginWithTelegramLoginUseCase,
    LoginWithTelegramMiniAppUseCase,
    TelegramAuthService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
