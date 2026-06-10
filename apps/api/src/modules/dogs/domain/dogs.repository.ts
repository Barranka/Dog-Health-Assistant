import type { DogSex } from './dog-sex.js';
import type { DogProfile } from './dog-profile.js';

export const DOGS_REPOSITORY = Symbol('DOGS_REPOSITORY');

export interface CreateDogInput {
  userId: string;
  name: string;
  breed?: string | null;
  sex: DogSex;
  birthDate?: Date | null;
  weight?: number | null;
  color?: string | null;
  sterilized?: boolean;
  notes?: string | null;
}

export interface UpdateDogInput {
  name?: string;
  breed?: string | null;
  sex?: DogSex;
  birthDate?: Date | null;
  weight?: number | null;
  color?: string | null;
  sterilized?: boolean;
  notes?: string | null;
}

export interface DogsRepository {
  create(input: CreateDogInput): Promise<DogProfile>;
  findManyByUserId(userId: string): Promise<DogProfile[]>;
  findByIdForUser(id: string, userId: string): Promise<DogProfile | null>;
  updateByIdForUser(id: string, userId: string, input: UpdateDogInput): Promise<DogProfile | null>;
  deleteByIdForUser(id: string, userId: string): Promise<boolean>;
}
