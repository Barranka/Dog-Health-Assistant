import type { EventInput } from '@fullcalendar/core';

import { getCalendarEventStyle } from './calendarEventStyles.js';
import type { CalendarEventItem } from './calendarEventTypes.js';
import type { TranslationKey } from '../i18n/dictionaries.js';

export function toFullCalendarEvents(
  events: CalendarEventItem[],
  t: (key: TranslationKey) => string,
): EventInput[] {
  return events.map((event) => {
    const style = getCalendarEventStyle(event.kind, event.healthEventType);
    const title = event.shortTitleKey ? `${t(event.shortTitleKey)} · ${event.title}` : event.title;
    const fullCalendarEvent: EventInput = {
      id: event.id,
      title,
      start: event.date,
      allDay: true,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      textColor: style.textColor,
      classNames: ['health-calendar-event'],
      extendedProps: {
        kind: event.kind,
        healthEventType: event.healthEventType,
        description: event.description,
      },
    };

    if (event.displayEndDate ?? event.endDate) {
      fullCalendarEvent.end = addOneDay(event.displayEndDate ?? event.endDate ?? event.date);
    }

    return fullCalendarEvent;
  });
}

function addOneDay(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
}
