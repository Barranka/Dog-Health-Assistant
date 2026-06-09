import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { AuthenticatedUser } from '../domain/authenticated-user.js';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository.js';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }
}
