import { Inject, Injectable } from '@nestjs/common';
import { Prisma, type HealthEventType } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import {
  NOTIFICATIONS_REPOSITORY,
  type CreateNotificationInput,
  type NotificationsRepository,
} from '../domain/notifications.repository.js';
import {
  addDays,
  getElapsedDayDifference,
  getInclusiveDayDifference,
  getUtcDayRange,
} from './notification-schedule.js';

export interface GenerateDueNotificationsResult {
  createdCount: number;
}

@Injectable()
export class GenerateDueNotificationsUseCase {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(now = new Date(), userId?: string): Promise<GenerateDueNotificationsResult> {
    const dayRange = getUtcDayRange(now);
    const notifications = [
      ...(await this.getHealthEventNotifications(dayRange.start, dayRange.end, userId)),
      ...(await this.getHeatCycleCheckNotifications(dayRange.start, userId)),
      ...(await this.getHeatCycleForecastNotifications(dayRange.start, dayRange.end, userId)),
    ];
    const createdCount = await this.notificationsRepository.createManyIfNotExists(notifications);

    return {
      createdCount,
    };
  }

  private async getHealthEventNotifications(
    start: Date,
    end: Date,
    userId?: string,
  ): Promise<CreateNotificationInput[]> {
    const where: Prisma.HealthEventWhereInput = {
      nextReminderDate: {
        gte: start,
        lt: end,
      },
    };

    if (userId) {
      where.dog = {
        userId,
      };
    }

    const healthEvents = await this.prisma.healthEvent.findMany({
      where,
      include: {
        dog: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });

    return healthEvents.map((healthEvent) => ({
      userId: healthEvent.dog.userId,
      dogId: healthEvent.dog.id,
      type: 'health_event_reminder',
      title: `Напоминание: ${healthEvent.title}`,
      message: `${this.getHealthEventTypeLabel(healthEvent.type)} для ${healthEvent.dog.name}: ${healthEvent.title}`,
      scheduledAt: healthEvent.nextReminderDate ?? start,
      relatedEntityType: 'health_event',
      relatedEntityId: healthEvent.id,
    }));
  }

  private async getHeatCycleCheckNotifications(
    todayStart: Date,
    userId?: string,
  ): Promise<CreateNotificationInput[]> {
    const where: Prisma.HeatCycleWhereInput = {
      endDate: null,
      startDate: {
        lte: addDays(todayStart, -21),
      },
    };

    if (userId) {
      where.dog = {
        userId,
      };
    }

    const heatCycles = await this.prisma.heatCycle.findMany({
      where,
      include: {
        dog: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });

    return heatCycles.map((heatCycle) => {
      const cycleDay = getInclusiveDayDifference(heatCycle.startDate, todayStart);

      return {
        userId: heatCycle.dog.userId,
        dogId: heatCycle.dog.id,
        type: 'heat_cycle_check',
        title: 'Течка ещё продолжается?',
        message: `${heatCycle.dog.name}: день цикла ${cycleDay}. Если течка завершилась, добавьте дату окончания.`,
        scheduledAt: addDays(heatCycle.startDate, 21),
        relatedEntityType: 'heat_cycle',
        relatedEntityId: heatCycle.id,
      };
    });
  }

  private getHealthEventTypeLabel(type: HealthEventType): string {
    const labels: Record<HealthEventType, string> = {
      vaccination: 'Вакцинация',
      revaccination: 'Ревакцинация',
      deworming: 'Дегельминтизация',
      tick_treatment: 'Обработка от клещей',
      flea_treatment: 'Обработка от блох',
      weight_tracking: 'Учёт веса',
      vet_visit: 'Визит к ветеринару',
      surgery: 'Операция',
      other: 'Событие здоровья',
    };

    return labels[type];
  }

  private async getHeatCycleForecastNotifications(
    start: Date,
    end: Date,
    userId?: string,
  ): Promise<CreateNotificationInput[]> {
    const where: Prisma.DogWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    const dogs = await this.prisma.dog.findMany({
      where,
      select: {
        id: true,
        name: true,
        userId: true,
        heatCycles: {
          where: {
            predicted: false,
          },
          orderBy: {
            startDate: 'asc',
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return dogs.flatMap((dog) => {
      const lastCycle = dog.heatCycles.at(-1);

      if (!lastCycle || !lastCycle.endDate) {
        return [];
      }

      const averageCycleLengthDays = this.getAverageCycleLengthDays(dog.heatCycles);
      const forecastDate = addDays(lastCycle.startDate, averageCycleLengthDays ?? 180);

      if (forecastDate < start || forecastDate >= end) {
        return [];
      }

      return [
        {
          userId: dog.userId,
          dogId: dog.id,
          type: 'heat_cycle_forecast',
          title: 'Ожидается следующая течка',
          message: averageCycleLengthDays
            ? `${dog.name}: прогноз рассчитан по истории циклов.`
            : `${dog.name}: прогноз рассчитан по среднему интервалу около 6 месяцев.`,
          scheduledAt: forecastDate,
          relatedEntityType: 'heat_cycle',
          relatedEntityId: lastCycle.id,
        },
      ];
    });
  }

  private getAverageCycleLengthDays(heatCycles: Array<{ startDate: Date }>): number | null {
    if (heatCycles.length < 2) {
      return null;
    }

    const intervals: number[] = [];

    for (let index = 1; index < heatCycles.length; index += 1) {
      const previousCycle = heatCycles[index - 1];
      const cycle = heatCycles[index];

      if (previousCycle && cycle) {
        intervals.push(getElapsedDayDifference(previousCycle.startDate, cycle.startDate));
      }
    }

    if (intervals.length === 0) {
      return null;
    }

    const total = intervals.reduce((sum, interval) => sum + interval, 0);

    return Math.round(total / intervals.length);
  }
}
