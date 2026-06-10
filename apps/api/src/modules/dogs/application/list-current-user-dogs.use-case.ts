import { Inject, Injectable } from '@nestjs/common';

import type { DogProfile } from '../domain/dog-profile.js';
import { DOGS_REPOSITORY, type DogsRepository } from '../domain/dogs.repository.js';

@Injectable()
export class ListCurrentUserDogsUseCase {
  constructor(
    @Inject(DOGS_REPOSITORY)
    private readonly dogsRepository: DogsRepository,
  ) {}

  execute(userId: string): Promise<DogProfile[]> {
    return this.dogsRepository.findManyByUserId(userId);
  }
}
