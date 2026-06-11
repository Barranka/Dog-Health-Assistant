import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';

import { useI18n } from '../../i18n/useI18n.js';
import type { CalendarEventItem } from '../calendarEventTypes.js';
import { toFullCalendarEvents } from '../toFullCalendarEvents.js';

interface HealthCalendarProps {
  events: CalendarEventItem[];
}

export function HealthCalendar({ events }: HealthCalendarProps) {
  const { locale, t } = useI18n();
  const isRussian = locale === 'ru';

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-2">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locales={[ruLocale]}
        initialView="dayGridMonth"
        events={toFullCalendarEvents(events, t)}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        buttonText={
          isRussian
            ? {
                today: 'Сегодня',
                month: 'Месяц',
              }
            : {
                today: 'Today',
                month: 'Month',
              }
        }
        height="auto"
        locale={locale}
        firstDay={1}
        eventDidMount={(info) => {
          const description = getEventDescription(info.event.extendedProps);
          info.el.title = description ? `${info.event.title}\n${description}` : info.event.title;
        }}
        eventClick={(info) => {
          const description = getEventDescription(info.event.extendedProps);
          window.alert(description ? `${info.event.title}\n\n${description}` : info.event.title);
        }}
      />
    </div>
  );
}

function getEventDescription(extendedProps: unknown): string | null {
  if (!extendedProps || typeof extendedProps !== 'object') {
    return null;
  }

  const description = (extendedProps as { description?: unknown }).description;

  return typeof description === 'string' && description ? description : null;
}
