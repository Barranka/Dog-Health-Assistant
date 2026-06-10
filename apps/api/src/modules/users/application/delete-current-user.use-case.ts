import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { USERS_REPOSITORY, type UsersRepository } from '../domain/users.repository.js';

@Injectable()
export class DeleteCurrentUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    try {
      await this.usersRepository.deleteById(userId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('User was not found.');
      }

      throw error;
    }
  }
}
