import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../domain/authenticated-user.js';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository.js';
import { AuthTokenService, type AuthTokenResult } from './auth-token.service.js';

export interface DevAuthResult {
  user: AuthenticatedUser;
  token: AuthTokenResult;
}

@Injectable()
export class LoginWithDevUserUseCase {
  constructor(
    @Inject(AuthTokenService)
    private readonly authTokenService: AuthTokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<DevAuthResult> {
    if (process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException('Dev login is available only in development.');
    }

    const user = await this.userRepository.upsertTelegramUser({
      telegramId: 'dev-local-user',
      firstName: 'Dev',
      username: 'local_dev',
    });
    const token = await this.authTokenService.signUser(user);

    return {
      user,
      token,
    };
  }
}
