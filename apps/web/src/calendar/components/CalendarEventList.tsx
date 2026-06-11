import { getCalendarEventStyle } from '../calendarEventStyles.js';
import type { CalendarEventItem } from '../calendarEventTypes.js';
import { useI18n } from '../../i18n/useI18n.js';
import { getHealthEventTypeLabelKey } from '../../healthEvents/healthEventTypes.js';

interface CalendarEventListProps {
  events: CalendarEventItem[];
}

interface GroupedCalendarEvents {
  upcomingEvents: CalendarEventItem[];
  pastEvents: CalendarEventItem[];
}

export function CalendarEventList({ events }: CalendarEventListProps) {
  const { t } = useI18n();
  const { upcomingEvents, pastEvents } = groupCalendarEvents(events);

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-[var(--app-muted)]">
          {t('calendar.upcomingEvents')}
        </h3>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <CalendarEventListItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-[var(--app-card)] px-3 py-2 text-sm text-[var(--app-muted)]">
            {t('calendar.noUpcomingEvents')}
          </p>
        )}
      </section>

      {pastEvents.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--app-muted)]">
            {t('calendar.pastEvents')}
          </h3>
          <div className="space-y-2">
            {pastEvents.map((event) => (
              <CalendarEventListItem key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

interface CalendarEventListItemProps {
  event: CalendarEventItem;
}

function CalendarEventListItem({ event }: CalendarEventListItemProps) {
  const { t } = useI18n();
  const style = getCalendarEventStyle(event.kind, event.healthEventType);
  const typeLabel = getEventTypeLabel(event, t);

  return (
    <article className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{event.title}</p>
            {typeLabel ? (
              <span
                className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: style.backgroundColor,
                  border: `1px solid ${style.borderColor}`,
                  color: style.textColor,
                }}
              >
                {typeLabel}
              </span>
            ) : null}
          </div>
          {event.description ? (
            <p className="mt-1 text-sm leading-5 text-[var(--app-muted)]">{event.description}</p>
          ) : null}
        </div>
        <span
          className="inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: style.backgroundColor,
            border: `1px solid ${style.borderColor}`,
            color: style.textColor,
          }}
        >
          {formatEventDateRange(event)}
        </span>
      </div>
    </article>
  );
}

function getEventTypeLabel(
  event: CalendarEventItem,
  t: ReturnType<typeof useI18n>['t'],
): string | null {
  if (event.healthEventType) {
    const healthEventType = t(getHealthEventTypeLabelKey(event.healthEventType));

    return event.kind === 'reminder'
      ? `${t('calendar.reminderEvent')}: ${healthEventType}`
      : healthEventType;
  }

  if (event.kind === 'heatCycle') {
    return t('calendar.heatCycleEvent');
  }

  if (event.kind === 'predictedHeatCycle') {
    return t('calendar.predictedHeatCycleEvent');
  }

  return null;
}

function groupCalendarEvents(events: CalendarEventItem[]): GroupedCalendarEvents {
  const today = getTodayDate();
  const upcomingEvents = events
    .filter((event) => getEventRelevantDate(event) >= today)
    .sort((firstEvent, secondEvent) =>
      getEventRelevantDate(firstEvent).localeCompare(getEventRelevantDate(secondEvent)),
    );
  const pastEvents = events
    .filter((event) => getEventRelevantDate(event) < today)
    .sort((firstEvent, secondEvent) =>
      getEventRelevantDate(secondEvent).localeCompare(getEventRelevantDate(firstEvent)),
    );

  return {
    upcomingEvents,
    pastEvents,
  };
}

function getEventRelevantDate(event: CalendarEventItem): string {
  return event.displayEndDate ?? event.endDate ?? event.date;
}

function formatEventDateRange(event: CalendarEventItem): string {
  const endDate = event.displayEndDate ?? event.endDate;

  if (!endDate || endDate === event.date) {
    return formatDate(event.date);
  }

  return `${formatDate(event.date)} — ${formatDate(endDate)}`;
}

function formatDate(value: string): string {
  const date = value.slice(0, 10);
  const [year, month, day] = date.split('-');

  return `${day}.${month}.${year}`;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
