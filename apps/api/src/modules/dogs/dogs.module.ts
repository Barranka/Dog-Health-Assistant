import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { CreateCurrentUserDogUseCase } from './application/create-current-user-dog.use-case.js';
import { DeleteCurrentUserDogUseCase } from './application/delete-current-user-dog.use-case.js';
import { GetCurrentUserDogUseCase } from './application/get-current-user-dog.use-case.js';
import { ListCurrentUserDogsUseCase } from './application/list-current-user-dogs.use-case.js';
import { UpdateCurrentUserDogUseCase } from './application/update-current-user-dog.use-case.js';
import { DOGS_REPOSITORY } from './domain/dogs.repository.js';
import { PrismaDogsRepository } from './infrastructure/prisma-dogs.repository.js';
import { DogsController } from './presentation/dogs.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [DogsController],
  providers: [
    CreateCurrentUserDogUseCase,
    DeleteCurrentUserDogUseCase,
    GetCurrentUserDogUseCase,
    ListCurrentUserDogsUseCase,
    UpdateCurrentUserDogUseCase,
    {
      provide: DOGS_REPOSITORY,
      useClass: PrismaDogsRepository,
    },
  ],
})
export class DogsModule {}
