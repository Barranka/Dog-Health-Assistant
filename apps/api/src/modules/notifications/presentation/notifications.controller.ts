import { Controller, Get, Inject, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import type { JwtAuthenticatedUser } from '../../auth/domain/jwt-authenticated-user.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { CountCurrentUserUnreadNotificationsUseCase } from '../application/count-current-user-unread-notifications.use-case.js';
import { ListCurrentUserNotificationsUseCase } from '../application/list-current-user-notifications.use-case.js';
import { MarkCurrentUserNotificationReadUseCase } from '../application/mark-current-user-notification-read.use-case.js';
import { MarkCurrentUserNotificationsReadUseCase } from '../application/mark-current-user-notifications-read.use-case.js';
import { RunNotificationCheckUseCase } from '../application/run-notification-check.use-case.js';
import { MarkNotificationsReadResponseDto } from './dto/mark-notifications-read-response.dto.js';
import { NotificationResponseDto } from './dto/notification-response.dto.js';
import { RunNotificationCheckResponseDto } from './dto/run-notification-check-response.dto.js';
import { UnreadNotificationsCountResponseDto } from './dto/unread-notifications-count-response.dto.js';

interface AuthenticatedRequest extends Request {
  user: JwtAuthenticatedUser;
}

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(ListCurrentUserNotificationsUseCase)
    private readonly listCurrentUserNotificationsUseCase: ListCurrentUserNotificationsUseCase,
    @Inject(CountCurrentUserUnreadNotificationsUseCase)
    private readonly countCurrentUserUnreadNotificationsUseCase: CountCurrentUserUnreadNotificationsUseCase,
    @Inject(MarkCurrentUserNotificationReadUseCase)
    private readonly markCurrentUserNotificationReadUseCase: MarkCurrentUserNotificationReadUseCase,
    @Inject(MarkCurrentUserNotificationsReadUseCase)
    private readonly markCurrentUserNotificationsReadUseCase: MarkCurrentUserNotificationsReadUseCase,
    @Inject(RunNotificationCheckUseCase)
    private readonly runNotificationCheckUseCase: RunNotificationCheckUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List current user notifications' })
  @ApiOkResponse({ type: NotificationResponseDto, isArray: true })
  listNotifications(@Req() request: AuthenticatedRequest): Promise<NotificationResponseDto[]> {
    return this.listCurrentUserNotificationsUseCase.execute(request.user.sub);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Count unread current user notifications' })
  @ApiOkResponse({ type: UnreadNotificationsCountResponseDto })
  async countUnreadNotifications(
    @Req() request: AuthenticatedRequest,
  ): Promise<UnreadNotificationsCountResponseDto> {
    const unreadCount = await this.countCurrentUserUnreadNotificationsUseCase.execute(
      request.user.sub,
    );

    return {
      unreadCount,
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark current user notification as read' })
  @ApiOkResponse({ type: NotificationResponseDto })
  markNotificationRead(
    @Req() request: AuthenticatedRequest,
    @Param('id') notificationId: string,
  ): Promise<NotificationResponseDto> {
    return this.markCurrentUserNotificationReadUseCase.execute(request.user.sub, notificationId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all current user notifications as read' })
  @ApiOkResponse({ type: MarkNotificationsReadResponseDto })
  async markNotificationsRead(
    @Req() request: AuthenticatedRequest,
  ): Promise<MarkNotificationsReadResponseDto> {
    const updatedCount = await this.markCurrentUserNotificationsReadUseCase.execute(
      request.user.sub,
    );

    return {
      updatedCount,
    };
  }

  @Post('dev/run-daily-check')
  @ApiOperation({ summary: 'Run notification check for current user in development' })
  @ApiOkResponse({ type: RunNotificationCheckResponseDto })
  runDailyCheck(@Req() request: AuthenticatedRequest): Promise<RunNotificationCheckResponseDto> {
    return this.runNotificationCheckUseCase.execute(new Date(), request.user.sub);
  }
}
