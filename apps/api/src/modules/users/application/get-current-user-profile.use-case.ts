import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { UserProfile } from '../domain/user-profile.js';
import { USERS_REPOSITORY, type UsersRepository } from '../domain/users.repository.js';

@Injectable()
export class GetCurrentUserProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(userId: string): Promise<UserProfile> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }
}
