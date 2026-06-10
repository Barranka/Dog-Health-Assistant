import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import type { JwtAuthenticatedUser } from '../../auth/domain/jwt-authenticated-user.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { DeleteCurrentUserUseCase } from '../application/delete-current-user.use-case.js';
import { GetCurrentUserProfileUseCase } from '../application/get-current-user-profile.use-case.js';
import {
  type UpdateCurrentUserProfileInput,
  UpdateCurrentUserProfileUseCase,
} from '../application/update-current-user-profile.use-case.js';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto.js';
import { UserProfileResponseDto } from './dto/user-profile-response.dto.js';

interface AuthenticatedRequest extends Request {
  user: JwtAuthenticatedUser;
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(GetCurrentUserProfileUseCase)
    private readonly getCurrentUserProfileUseCase: GetCurrentUserProfileUseCase,
    @Inject(UpdateCurrentUserProfileUseCase)
    private readonly updateCurrentUserProfileUseCase: UpdateCurrentUserProfileUseCase,
    @Inject(DeleteCurrentUserUseCase)
    private readonly deleteCurrentUserUseCase: DeleteCurrentUserUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserProfileResponseDto })
  getCurrentUser(@Req() request: AuthenticatedRequest): Promise<UserProfileResponseDto> {
    return this.getCurrentUserProfileUseCase.execute(request.user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: UserProfileResponseDto })
  updateCurrentUser(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateCurrentUserDto,
  ): Promise<UserProfileResponseDto> {
    const input: UpdateCurrentUserProfileInput = {};

    if (dto.firstName !== undefined) {
      input.firstName = dto.firstName;
    }

    if (dto.username !== undefined) {
      input.username = dto.username;
    }

    return this.updateCurrentUserProfileUseCase.execute(request.user.sub, input);
  }

  @Delete('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete current user profile' })
  @ApiNoContentResponse({ description: 'Current user has been deleted.' })
  deleteCurrentUser(@Req() request: AuthenticatedRequest): Promise<void> {
    return this.deleteCurrentUserUseCase.execute(request.user.sub);
  }
}
