import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../domain/authenticated-user.js';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository.js';
import { AuthTokenService, type AuthTokenResult } from './auth-token.service.js';
import { TelegramAuthService } from './telegram-auth.service.js';

export interface AuthResult {
  user: AuthenticatedUser;
  token: AuthTokenResult;
}

@Injectable()
export class LoginWithTelegramMiniAppUseCase {
  constructor(
    @Inject(TelegramAuthService)
    private readonly telegramAuthService: TelegramAuthService,
    @Inject(AuthTokenService)
    private readonly authTokenService: AuthTokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(initData: string): Promise<AuthResult> {
    const telegramUser = this.telegramAuthService.verifyMiniAppInitData(initData);
    const user = await this.userRepository.upsertTelegramUser(telegramUser);
    const token = await this.authTokenService.signUser(user);

    return {
      user,
      token,
    };
  }
}
