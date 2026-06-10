import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { DOGS_REPOSITORY, type DogsRepository } from '../domain/dogs.repository.js';

@Injectable()
export class DeleteCurrentUserDogUseCase {
  constructor(
    @Inject(DOGS_REPOSITORY)
    private readonly dogsRepository: DogsRepository,
  ) {}

  async execute(userId: string, dogId: string): Promise<void> {
    const deleted = await this.dogsRepository.deleteByIdForUser(dogId, userId);

    if (!deleted) {
      throw new NotFoundException('Dog was not found.');
    }
  }
}
