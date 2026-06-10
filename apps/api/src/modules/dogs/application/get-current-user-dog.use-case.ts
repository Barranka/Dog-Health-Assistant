import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { DogProfile } from '../domain/dog-profile.js';
import { DOGS_REPOSITORY, type DogsRepository } from '../domain/dogs.repository.js';

@Injectable()
export class GetCurrentUserDogUseCase {
  constructor(
    @Inject(DOGS_REPOSITORY)
    private readonly dogsRepository: DogsRepository,
  ) {}

  async execute(userId: string, dogId: string): Promise<DogProfile> {
    const dog = await this.dogsRepository.findByIdForUser(dogId, userId);

    if (!dog) {
      throw new NotFoundException('Dog was not found.');
    }

    return dog;
  }
}
