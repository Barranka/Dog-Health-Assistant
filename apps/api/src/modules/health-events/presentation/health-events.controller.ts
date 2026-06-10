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
  CreateCurrentUserHealthEventUseCase,
  type CreateCurrentUserHealthEventInput,
} from '../application/create-current-user-health-event.use-case.js';
import { DeleteCurrentUserHealthEventUseCase } from '../application/delete-current-user-health-event.use-case.js';
import { GetCurrentUserHealthEventUseCase } from '../application/get-current-user-health-event.use-case.js';
import { ListCurrentUserHealthEventsUseCase } from '../application/list-current-user-health-events.use-case.js';
import {
  type UpdateCurrentUserHealthEventInput,
  UpdateCurrentUserHealthEventUseCase,
} from '../application/update-current-user-health-event.use-case.js';
import { CreateHealthEventDto } from './dto/create-health-event.dto.js';
import { HealthEventResponseDto } from './dto/health-event-response.dto.js';
import { UpdateHealthEventDto } from './dto/update-health-event.dto.js';

interface AuthenticatedRequest extends Request {
  user: JwtAuthenticatedUser;
}

@ApiTags('Health Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dogs/:dogId/health-events')
export class HealthEventsController {
  constructor(
    @Inject(ListCurrentUserHealthEventsUseCase)
    private readonly listCurrentUserHealthEventsUseCase: ListCurrentUserHealthEventsUseCase,
    @Inject(GetCurrentUserHealthEventUseCase)
    private readonly getCurrentUserHealthEventUseCase: GetCurrentUserHealthEventUseCase,
    @Inject(CreateCurrentUserHealthEventUseCase)
    private readonly createCurrentUserHealthEventUseCase: CreateCurrentUserHealthEventUseCase,
    @Inject(UpdateCurrentUserHealthEventUseCase)
    private readonly updateCurrentUserHealthEventUseCase: UpdateCurrentUserHealthEventUseCase,
    @Inject(DeleteCurrentUserHealthEventUseCase)
    private readonly deleteCurrentUserHealthEventUseCase: DeleteCurrentUserHealthEventUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List health events for current user dog' })
  @ApiOkResponse({ type: HealthEventResponseDto, isArray: true })
  listHealthEvents(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
  ): Promise<HealthEventResponseDto[]> {
    return this.listCurrentUserHealthEventsUseCase.execute(request.user.sub, dogId);
  }

  @Post()
  @ApiOperation({ summary: 'Create health event for current user dog' })
  @ApiCreatedResponse({ type: HealthEventResponseDto })
  createHealthEvent(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Body() dto: CreateHealthEventDto,
  ): Promise<HealthEventResponseDto> {
    return this.createCurrentUserHealthEventUseCase.execute(
      request.user.sub,
      dogId,
      this.toCreateHealthEventInput(dto),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get health event by id for current user dog' })
  @ApiOkResponse({ type: HealthEventResponseDto })
  getHealthEvent(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Param('id') healthEventId: string,
  ): Promise<HealthEventResponseDto> {
    return this.getCurrentUserHealthEventUseCase.execute(request.user.sub, dogId, healthEventId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update health event by id for current user dog' })
  @ApiOkResponse({ type: HealthEventResponseDto })
  updateHealthEvent(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Param('id') healthEventId: string,
    @Body() dto: UpdateHealthEventDto,
  ): Promise<HealthEventResponseDto> {
    return this.updateCurrentUserHealthEventUseCase.execute(
      request.user.sub,
      dogId,
      healthEventId,
      this.toUpdateHealthEventInput(dto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete health event by id for current user dog' })
  @ApiNoContentResponse({ description: 'Health event has been deleted.' })
  deleteHealthEvent(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Param('id') healthEventId: string,
  ): Promise<void> {
    return this.deleteCurrentUserHealthEventUseCase.execute(request.user.sub, dogId, healthEventId);
  }

  private toCreateHealthEventInput(dto: CreateHealthEventDto): CreateCurrentUserHealthEventInput {
    const input: CreateCurrentUserHealthEventInput = {
      type: dto.type,
      title: dto.title,
      eventDate: new Date(dto.eventDate),
    };

    if (dto.nextReminderDate !== undefined) {
      input.nextReminderDate = dto.nextReminderDate ? new Date(dto.nextReminderDate) : null;
    }

    if (dto.notes !== undefined) {
      input.notes = dto.notes;
    }

    return input;
  }

  private toUpdateHealthEventInput(dto: UpdateHealthEventDto): UpdateCurrentUserHealthEventInput {
    const input: UpdateCurrentUserHealthEventInput = {};

    if (dto.type !== undefined) {
      input.type = dto.type;
    }

    if (dto.title !== undefined) {
      input.title = dto.title;
    }

    if (dto.eventDate !== undefined) {
      input.eventDate = new Date(dto.eventDate);
    }

    if (dto.nextReminderDate !== undefined) {
      input.nextReminderDate = dto.nextReminderDate ? new Date(dto.nextReminderDate) : null;
    }

    if (dto.notes !== undefined) {
      input.notes = dto.notes;
    }

    return input;
  }
}
