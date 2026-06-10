import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { UserProfile } from '../domain/user-profile.js';
import type { UpdateUserProfileInput, UsersRepository } from '../domain/users.repository.js';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user ? this.toUserProfile(user) : null;
  }

  async updateById(id: string, input: UpdateUserProfileInput): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: input,
    });

    return this.toUserProfile(user);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  private toUserProfile(user: {
    id: string;
    telegramId: string;
    firstName: string | null;
    username: string | null;
    createdAt: Date;
  }): UserProfile {
    return {
      id: user.id,
      telegramId: user.telegramId,
      firstName: user.firstName,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
