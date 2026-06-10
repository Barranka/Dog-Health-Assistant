import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { GetCurrentUserUseCase } from '../application/get-current-user.use-case.js';
import {
  LoginWithDevUserUseCase,
  type DevAuthResult,
} from '../application/login-with-dev-user.use-case.js';
import {
  LoginWithTelegramLoginUseCase,
  type TelegramLoginAuthResult,
} from '../application/login-with-telegram-login.use-case.js';
import {
  LoginWithTelegramMiniAppUseCase,
  type AuthResult,
} from '../application/login-with-telegram-mini-app.use-case.js';
import type { JwtAuthenticatedUser } from '../domain/jwt-authenticated-user.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { TelegramLoginDto } from './dto/telegram-login.dto.js';
import { TelegramMiniAppLoginDto } from './dto/telegram-mini-app-login.dto.js';

interface AuthenticatedRequest extends Request {
  user: JwtAuthenticatedUser;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginWithTelegramMiniAppUseCase)
    private readonly loginWithTelegramMiniAppUseCase: LoginWithTelegramMiniAppUseCase,
    @Inject(LoginWithTelegramLoginUseCase)
    private readonly loginWithTelegramLoginUseCase: LoginWithTelegramLoginUseCase,
    @Inject(LoginWithDevUserUseCase)
    private readonly loginWithDevUserUseCase: LoginWithDevUserUseCase,
    @Inject(GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('telegram-mini-app')
  @ApiOperation({ summary: 'Authorize with Telegram Mini App initData' })
  @ApiOkResponse({ description: 'User has been authorized.' })
  loginWithTelegramMiniApp(@Body() dto: TelegramMiniAppLoginDto): Promise<AuthResult> {
    return this.loginWithTelegramMiniAppUseCase.execute(dto.initData);
  }

  @Post('telegram-login')
  @ApiOperation({ summary: 'Authorize with Telegram Login widget payload' })
  @ApiOkResponse({ description: 'User has been authorized.' })
  loginWithTelegramLogin(@Body() dto: TelegramLoginDto): Promise<TelegramLoginAuthResult> {
    return this.loginWithTelegramLoginUseCase.execute({
      id: dto.id,
      firstName: dto.first_name ?? null,
      username: dto.username ?? null,
      authDate: dto.auth_date,
      hash: dto.hash,
    });
  }

  @Post('dev-login')
  @ApiOperation({ summary: 'Authorize as local development user' })
  @ApiOkResponse({ description: 'Development user has been authorized.' })
  loginWithDevUser(): Promise<DevAuthResult> {
    return this.loginWithDevUserUseCase.execute();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ description: 'Current user.' })
  getCurrentUser(@Req() request: AuthenticatedRequest) {
    return this.getCurrentUserUseCase.execute(request.user.sub);
  }
}
