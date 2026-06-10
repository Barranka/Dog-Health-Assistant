import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { UserProfile } from '../domain/user-profile.js';
import { USERS_REPOSITORY, type UsersRepository } from '../domain/users.repository.js';

export interface UpdateCurrentUserProfileInput {
  firstName?: string | null;
  username?: string | null;
}

@Injectable()
export class UpdateCurrentUserProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(userId: string, input: UpdateCurrentUserProfileInput): Promise<UserProfile> {
    try {
      return await this.usersRepository.updateById(userId, input);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('User was not found.');
      }

      throw error;
    }
  }
}
