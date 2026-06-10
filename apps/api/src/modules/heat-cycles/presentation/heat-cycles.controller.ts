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
  CreateCurrentUserHeatCycleUseCase,
  type CreateCurrentUserHeatCycleInput,
} from '../application/create-current-user-heat-cycle.use-case.js';
import { DeleteCurrentUserHeatCycleUseCase } from '../application/delete-current-user-heat-cycle.use-case.js';
import { GetCurrentUserHeatCycleUseCase } from '../application/get-current-user-heat-cycle.use-case.js';
import { ListCurrentUserHeatCyclesUseCase } from '../application/list-current-user-heat-cycles.use-case.js';
import {
  type UpdateCurrentUserHeatCycleInput,
  UpdateCurrentUserHeatCycleUseCase,
} from '../application/update-current-user-heat-cycle.use-case.js';
import { CreateHeatCycleDto } from './dto/create-heat-cycle.dto.js';
import { HeatCycleResponseDto } from './dto/heat-cycle-response.dto.js';
import { UpdateHeatCycleDto } from './dto/update-heat-cycle.dto.js';

interface AuthenticatedRequest extends Request {
  user: JwtAuthenticatedUser;
}

@ApiTags('Heat Cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dogs/:dogId/heat-cycles')
export class HeatCyclesController {
  constructor(
    @Inject(ListCurrentUserHeatCyclesUseCase)
    private readonly listCurrentUserHeatCyclesUseCase: ListCurrentUserHeatCyclesUseCase,
    @Inject(GetCurrentUserHeatCycleUseCase)
    private readonly getCurrentUserHeatCycleUseCase: GetCurrentUserHeatCycleUseCase,
    @Inject(CreateCurrentUserHeatCycleUseCase)
    private readonly createCurrentUserHeatCycleUseCase: CreateCurrentUserHeatCycleUseCase,
    @Inject(UpdateCurrentUserHeatCycleUseCase)
    private readonly updateCurrentUserHeatCycleUseCase: UpdateCurrentUserHeatCycleUseCase,
    @Inject(DeleteCurrentUserHeatCycleUseCase)
    private readonly deleteCurrentUserHeatCycleUseCase: DeleteCurrentUserHeatCycleUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List heat cycles for current user dog' })
  @ApiOkResponse({ type: HeatCycleResponseDto, isArray: true })
  listHeatCycles(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
  ): Promise<HeatCycleResponseDto[]> {
    return this.listCurrentUserHeatCyclesUseCase.execute(request.user.sub, dogId);
  }

  @Post()
  @ApiOperation({ summary: 'Create heat cycle for current user dog' })
  @ApiCreatedResponse({ type: HeatCycleResponseDto })
  createHeatCycle(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Body() dto: CreateHeatCycleDto,
  ): Promise<HeatCycleResponseDto> {
    return this.createCurrentUserHeatCycleUseCase.execute(
      request.user.sub,
      dogId,
      this.toCreateHeatCycleInput(dto),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get heat cycle by id for current user dog' })
  @ApiOkResponse({ type: HeatCycleResponseDto })
  getHeatCycle(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Param('id') heatCycleId: string,
  ): Promise<HeatCycleResponseDto> {
    return this.getCurrentUserHeatCycleUseCase.execute(request.user.sub, dogId, heatCycleId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update heat cycle by id for current user dog' })
  @ApiOkResponse({ type: HeatCycleResponseDto })
  updateHeatCycle(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Param('id') heatCycleId: string,
    @Body() dto: UpdateHeatCycleDto,
  ): Promise<HeatCycleResponseDto> {
    return this.updateCurrentUserHeatCycleUseCase.execute(
      request.user.sub,
      dogId,
      heatCycleId,
      this.toUpdateHeatCycleInput(dto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete heat cycle by id for current user dog' })
  @ApiNoContentResponse({ description: 'Heat cycle has been deleted.' })
  deleteHeatCycle(
    @Req() request: AuthenticatedRequest,
    @Param('dogId') dogId: string,
    @Param('id') heatCycleId: string,
  ): Promise<void> {
    return this.deleteCurrentUserHeatCycleUseCase.execute(request.user.sub, dogId, heatCycleId);
  }

  private toCreateHeatCycleInput(dto: CreateHeatCycleDto): CreateCurrentUserHeatCycleInput {
    const input: CreateCurrentUserHeatCycleInput = {
      startDate: new Date(dto.startDate),
    };

    if (dto.endDate !== undefined) {
      input.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    if (dto.predicted !== undefined) {
      input.predicted = dto.predicted;
    }

    if (dto.notes !== undefined) {
      input.notes = dto.notes;
    }

    return input;
  }

  private toUpdateHeatCycleInput(dto: UpdateHeatCycleDto): UpdateCurrentUserHeatCycleInput {
    const input: UpdateCurrentUserHeatCycleInput = {};

    if (dto.startDate !== undefined) {
      input.startDate = new Date(dto.startDate);
    }

    if (dto.endDate !== undefined) {
      input.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    if (dto.predicted !== undefined) {
      input.predicted = dto.predicted;
    }

    if (dto.notes !== undefined) {
      input.notes = dto.notes;
    }

    return input;
  }
}
