import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { DeleteCurrentUserUseCase } from './application/delete-current-user.use-case.js';
import { GetCurrentUserProfileUseCase } from './application/get-current-user-profile.use-case.js';
import { UpdateCurrentUserProfileUseCase } from './application/update-current-user-profile.use-case.js';
import { USERS_REPOSITORY } from './domain/users.repository.js';
import { PrismaUsersRepository } from './infrastructure/prisma-users.repository.js';
import { UsersController } from './presentation/users.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    DeleteCurrentUserUseCase,
    GetCurrentUserProfileUseCase,
    UpdateCurrentUserProfileUseCase,
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class UsersModule {}
