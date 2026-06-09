import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { AuthenticatedUser } from '../domain/authenticated-user.js';
import type { UpsertTelegramUserInput, UserRepository } from '../domain/user.repository.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user ? this.toAuthenticatedUser(user) : null;
  }

  async upsertTelegramUser(input: UpsertTelegramUserInput): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.upsert({
      where: {
        telegramId: input.telegramId,
      },
      update: {
        firstName: input.firstName,
        username: input.username,
      },
      create: {
        telegramId: input.telegramId,
        firstName: input.firstName,
        username: input.username,
      },
    });

    return this.toAuthenticatedUser(user);
  }

  private toAuthenticatedUser(user: {
    id: string;
    telegramId: string;
    firstName: string | null;
    username: string | null;
  }): AuthenticatedUser {
    return {
      id: user.id,
      telegramId: user.telegramId,
      firstName: user.firstName,
      username: user.username,
    };
  }
}
