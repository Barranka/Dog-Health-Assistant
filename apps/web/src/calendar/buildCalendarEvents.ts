import type { HealthEventRecord, HeatCycleRecord } from '../api/types.js';
import { getHealthEventTypeShortLabelKey } from '../healthEvents/healthEventTypes.js';
import { formatDateOnly, getHeatCycleForecast } from '../heatCycles/heatCycleForecast.js';
import type { CalendarEventItem } from './calendarEventTypes.js';

interface BuildCalendarEventsInput {
  heatCycles: HeatCycleRecord[];
  healthEvents: HealthEventCalendarSource[];
}

type HealthEventCalendarSource = HealthEventRecord & {
  date?: string;
  endDate?: string | null;
};

export function buildCalendarEvents({
  heatCycles,
  healthEvents,
}: BuildCalendarEventsInput): CalendarEventItem[] {
  const heatCycleEvents = heatCycles.map((heatCycle): CalendarEventItem => {
    const displayEndDate = heatCycle.endDate ?? getTodayDate();

    return {
      id: `heat-cycle-${heatCycle.id}`,
      kind: heatCycle.predicted ? 'predictedHeatCycle' : 'heatCycle',
      title: heatCycle.predicted ? 'Прогноз течки' : 'Течка',
      date: heatCycle.startDate,
      endDate: heatCycle.endDate,
      displayEndDate,
      description: heatCycle.notes,
    };
  });
  const heatCycleForecast = getHeatCycleForecast(heatCycles);
  const forecastEvent = heatCycleForecast
    ? [
        {
          id: 'heat-cycle-forecast-next',
          kind: 'predictedHeatCycle',
          title: 'Прогноз течки',
          date: formatDateOnly(heatCycleForecast.nextHeatEstimatedAt),
          endDate: null,
          description: heatCycleForecast.isPersonalized
            ? 'Прогноз рассчитан по истории циклов питомца.'
            : 'Прогноз рассчитан по среднему интервалу около 6 месяцев.',
        } satisfies CalendarEventItem,
      ]
    : [];

  const healthEventItems = healthEvents
    .map((healthEvent): CalendarEventItem | null => {
      const eventDate = healthEvent.eventDate || healthEvent.date;

      if (!eventDate) {
        return null;
      }

      return {
        id: `health-event-${healthEvent.id}`,
        kind: 'healthEvent',
        healthEventType: healthEvent.type,
        shortTitleKey: getHealthEventTypeShortLabelKey(healthEvent.type),
        title: healthEvent.title,
        date: toDateOnly(eventDate),
        endDate: healthEvent.endDate ? toDateOnly(healthEvent.endDate) : null,
        description: healthEvent.notes,
      };
    })
    .filter((event): event is CalendarEventItem => Boolean(event));
  const reminderItems = healthEvents
    .map((healthEvent): CalendarEventItem | null => {
      if (!healthEvent.nextReminderDate) {
        return null;
      }

      return {
        id: `health-event-reminder-${healthEvent.id}`,
        kind: 'reminder',
        healthEventType: healthEvent.type,
        shortTitleKey: getHealthEventTypeShortLabelKey(healthEvent.type),
        title: `Напоминание: ${healthEvent.title}`,
        date: toDateOnly(healthEvent.nextReminderDate),
        endDate: null,
        description: healthEvent.notes,
      };
    })
    .filter((event): event is CalendarEventItem => Boolean(event));

  return [...heatCycleEvents, ...forecastEvent, ...healthEventItems, ...reminderItems].sort(
    (firstEvent, secondEvent) => firstEvent.date.localeCompare(secondEvent.date),
  );
}

function toDateOnly(value: string): string {
  return value.slice(0, 10);
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
