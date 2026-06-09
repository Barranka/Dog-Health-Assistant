import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../domain/authenticated-user.js';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository.js';
import { AuthTokenService, type AuthTokenResult } from './auth-token.service.js';
import { TelegramAuthService } from './telegram-auth.service.js';

interface LoginWithTelegramLoginInput {
  id: string;
  firstName: string | null;
  username: string | null;
  authDate: number;
  hash: string;
}

export interface TelegramLoginAuthResult {
  user: AuthenticatedUser;
  token: AuthTokenResult;
}

@Injectable()
export class LoginWithTelegramLoginUseCase {
  constructor(
    @Inject(TelegramAuthService)
    private readonly telegramAuthService: TelegramAuthService,
    @Inject(AuthTokenService)
    private readonly authTokenService: AuthTokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: LoginWithTelegramLoginInput): Promise<TelegramLoginAuthResult> {
    const payload = {
      id: input.id,
      auth_date: input.authDate,
      hash: input.hash,
      ...(input.firstName ? { first_name: input.firstName } : {}),
      ...(input.username ? { username: input.username } : {}),
    };

    const telegramUser = this.telegramAuthService.verifyTelegramLogin(payload);
    const user = await this.userRepository.upsertTelegramUser(telegramUser);
    const token = await this.authTokenService.signUser(user);

    return {
      user,
      token,
    };
  }
}
