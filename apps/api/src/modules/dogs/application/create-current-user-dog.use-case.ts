import { Inject, Injectable } from '@nestjs/common';

import type { DogProfile } from '../domain/dog-profile.js';
import type { DogSex } from '../domain/dog-sex.js';
import { DOGS_REPOSITORY, type DogsRepository } from '../domain/dogs.repository.js';

export interface CreateCurrentUserDogInput {
  name: string;
  breed?: string | null;
  sex: DogSex;
  birthDate?: Date | null;
  weight?: number | null;
  color?: string | null;
  sterilized?: boolean;
  notes?: string | null;
}

@Injectable()
export class CreateCurrentUserDogUseCase {
  constructor(
    @Inject(DOGS_REPOSITORY)
    private readonly dogsRepository: DogsRepository,
  ) {}

  execute(userId: string, input: CreateCurrentUserDogInput): Promise<DogProfile> {
    return this.dogsRepository.create({
      userId,
      ...input,
    });
  }
}
