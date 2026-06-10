import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { DogProfile } from '../domain/dog-profile.js';
import type { DogSex } from '../domain/dog-sex.js';
import { DOGS_REPOSITORY, type DogsRepository } from '../domain/dogs.repository.js';

export interface UpdateCurrentUserDogInput {
  name?: string;
  breed?: string | null;
  sex?: DogSex;
  birthDate?: Date | null;
  weight?: number | null;
  color?: string | null;
  sterilized?: boolean;
  notes?: string | null;
}

@Injectable()
export class UpdateCurrentUserDogUseCase {
  constructor(
    @Inject(DOGS_REPOSITORY)
    private readonly dogsRepository: DogsRepository,
  ) {}

  async execute(
    userId: string,
    dogId: string,
    input: UpdateCurrentUserDogInput,
  ): Promise<DogProfile> {
    const dog = await this.dogsRepository.updateByIdForUser(dogId, userId, input);

    if (!dog) {
      throw new NotFoundException('Dog was not found.');
    }

    return dog;
  }
}
