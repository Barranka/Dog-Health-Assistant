import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import type { JwtAuthenticatedUser } from '../../auth/domain/jwt-authenticated-user.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import {
  CreateCurrentUserDogUseCase,
  type CreateCurrentUserDogInput,
} from '../application/create-current-user-dog.use-case.js';
import { DeleteCurrentUserDogUseCase } from '../application/delete-current-user-dog.use-case.js';
import { GetCurrentUserDogUseCase } from '../application/get-current-user-dog.use-case.js';
import { ListCurrentUserDogsUseCase } from '../application/list-current-user-dogs.use-case.js';
import {
  type UpdateCurrentUserDogInput,
  UpdateCurrentUserDogUseCase,
} from '../application/update-current-user-dog.use-case.js';
import { CreateDogDto } from './dto/create-dog.dto.js';
import { DogResponseDto } from './dto/dog-response.dto.js';
import { UpdateDogDto } from './dto/update-dog.dto.js';

interface AuthenticatedRequest extends Request {
  user: JwtAuthenticatedUser;
}

@ApiTags('Dogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dogs')
export class DogsController {
  constructor(
    @Inject(ListCurrentUserDogsUseCase)
    private readonly listCurrentUserDogsUseCase: ListCurrentUserDogsUseCase,
    @Inject(GetCurrentUserDogUseCase)
    private readonly getCurrentUserDogUseCase: GetCurrentUserDogUseCase,
    @Inject(CreateCurrentUserDogUseCase)
    private readonly createCurrentUserDogUseCase: CreateCurrentUserDogUseCase,
    @Inject(UpdateCurrentUserDogUseCase)
    private readonly updateCurrentUserDogUseCase: UpdateCurrentUserDogUseCase,
    @Inject(DeleteCurrentUserDogUseCase)
    private readonly deleteCurrentUserDogUseCase: DeleteCurrentUserDogUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List current user dogs' })
  @ApiOkResponse({ type: DogResponseDto, isArray: true })
  listDogs(@Req() request: AuthenticatedRequest): Promise<DogResponseDto[]> {
    return this.listCurrentUserDogsUseCase.execute(request.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create dog for current user' })
  @ApiCreatedResponse({ type: DogResponseDto })
  createDog(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateDogDto,
  ): Promise<DogResponseDto> {
    return this.createCurrentUserDogUseCase.execute(request.user.sub, this.toCreateDogInput(dto));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get current user dog by id' })
  @ApiOkResponse({ type: DogResponseDto })
  getDog(
    @Req() request: AuthenticatedRequest,
    @Param('id') dogId: string,
  ): Promise<DogResponseDto> {
    return this.getCurrentUserDogUseCase.execute(request.user.sub, dogId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update current user dog by id' })
  @ApiOkResponse({ type: DogResponseDto })
  updateDog(
    @Req() request: AuthenticatedRequest,
    @Param('id') dogId: string,
    @Body() dto: UpdateDogDto,
  ): Promise<DogResponseDto> {
    return this.updateCurrentUserDogUseCase.execute(
      request.user.sub,
      dogId,
      this.toUpdateDogInput(dto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete current user dog by id' })
  @ApiNoContentResponse({ description: 'Dog has been deleted.' })
  deleteDog(@Req() request: AuthenticatedRequest, @Param('id') dogId: string): Promise<void> {
    return this.deleteCurrentUserDogUseCase.execute(request.user.sub, dogId);
  }

  private toCreateDogInput(dto: CreateDogDto): CreateCurrentUserDogInput {
    const input: CreateCurrentUserDogInput = {
      name: dto.name,
      sex: dto.sex,
    };

    if (dto.breed !== undefined) {
      input.breed = dto.breed;
    }

    if (dto.birthDate !== undefined) {
      input.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    }

    if (dto.weight !== undefined) {
      input.weight = dto.weight;
    }

    if (dto.color !== undefined) {
      input.color = dto.color;
    }

    if (dto.sterilized !== undefined) {
      input.sterilized = dto.sterilized;
    }

    if (dto.notes !== undefined) {
      input.notes = dto.notes;
    }

    return input;
  }

  private toUpdateDogInput(dto: UpdateDogDto): UpdateCurrentUserDogInput {
    const input: UpdateCurrentUserDogInput = {};

    if (dto.name !== undefined) {
      input.name = dto.name;
    }

    if (dto.breed !== undefined) {
      input.breed = dto.breed;
    }

    if (dto.sex !== undefined) {
      input.sex = dto.sex;
    }

    if (dto.birthDate !== undefined) {
      input.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    }

    if (dto.weight !== undefined) {
      input.weight = dto.weight;
    }

    if (dto.color !== undefined) {
      input.color = dto.color;
    }

    if (dto.sterilized !== undefined) {
      input.sterilized = dto.sterilized;
    }

    if (dto.notes !== undefined) {
      input.notes = dto.notes;
    }

    return input;
  }
}
