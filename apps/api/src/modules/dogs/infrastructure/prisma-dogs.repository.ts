import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { DogProfile } from '../domain/dog-profile.js';
import type { DogSex } from '../domain/dog-sex.js';
import type { CreateDogInput, DogsRepository, UpdateDogInput } from '../domain/dogs.repository.js';

@Injectable()
export class PrismaDogsRepository implements DogsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(input: CreateDogInput): Promise<DogProfile> {
    const data: Prisma.DogUncheckedCreateInput = {
      userId: input.userId,
      name: input.name,
      sex: input.sex,
    };

    if (input.breed !== undefined) {
      data.breed = input.breed;
    }

    if (input.birthDate !== undefined) {
      data.birthDate = input.birthDate;
    }

    if (input.weight !== undefined) {
      data.weight = input.weight;
    }

    if (input.color !== undefined) {
      data.color = input.color;
    }

    if (input.sterilized !== undefined) {
      data.sterilized = input.sterilized;
    }

    if (input.notes !== undefined) {
      data.notes = input.notes;
    }

    const dog = await this.prisma.dog.create({
      data,
    });

    return this.toDogProfile(dog);
  }

  async findManyByUserId(userId: string): Promise<DogProfile[]> {
    const dogs = await this.prisma.dog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return dogs.map((dog) => this.toDogProfile(dog));
  }

  async findByIdForUser(id: string, userId: string): Promise<DogProfile | null> {
    const dog = await this.prisma.dog.findFirst({
      where: {
        id,
        userId,
      },
    });

    return dog ? this.toDogProfile(dog) : null;
  }

  async updateByIdForUser(
    id: string,
    userId: string,
    input: UpdateDogInput,
  ): Promise<DogProfile | null> {
    const dog = await this.prisma.dog.updateManyAndReturn({
      where: {
        id,
        userId,
      },
      data: input,
      limit: 1,
    });

    return dog[0] ? this.toDogProfile(dog[0]) : null;
  }

  async deleteByIdForUser(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.dog.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return result.count > 0;
  }

  private toDogProfile(dog: {
    id: string;
    userId: string;
    name: string;
    breed: string | null;
    sex: DogSex;
    birthDate: Date | null;
    weight: Prisma.Decimal | null;
    color: string | null;
    sterilized: boolean;
    notes: string | null;
    createdAt: Date;
  }): DogProfile {
    return {
      id: dog.id,
      userId: dog.userId,
      name: dog.name,
      breed: dog.breed,
      sex: dog.sex,
      birthDate: dog.birthDate,
      weight: dog.weight ? dog.weight.toNumber() : null,
      color: dog.color,
      sterilized: dog.sterilized,
      notes: dog.notes,
      createdAt: dog.createdAt,
    };
  }
}
