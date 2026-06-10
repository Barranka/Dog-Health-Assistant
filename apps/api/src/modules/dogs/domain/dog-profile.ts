import type { DogSex } from './dog-sex.js';

export interface DogProfile {
  id: string;
  userId: string;
  name: string;
  breed: string | null;
  sex: DogSex;
  birthDate: Date | null;
  weight: number | null;
  color: string | null;
  sterilized: boolean;
  notes: string | null;
  createdAt: Date;
}
