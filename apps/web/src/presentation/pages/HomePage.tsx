import { CalendarPlus, CircleAlert, HeartPulse, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buildCalendarEvents } from '../../calendar/buildCalendarEvents.js';
import type { CalendarEventItem } from '../../calendar/calendarEventTypes.js';
import { useActiveDog } from '../../dogs/useActiveDog.js';
import { useHealthEventsQuery } from '../../healthEvents/useHealthEventsQuery.js';
import { useHeatCyclesQuery } from '../../heatCycles/useHeatCyclesQuery.js';
import type { TranslationKey } from '../../i18n/dictionaries.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';
import { SectionHeader } from '../components/SectionHeader.js';

const quickActions = [
  {
    to: '/dogs',
    labelKey: 'common.addDog',
    icon: PawPrint,
  },
  {
    to: '/heat-cycles',
    labelKey: 'home.heatCycle',
    icon: CalendarPlus,
  },
  {
    to: '/health',
    labelKey: 'home.healthEvent',
    icon: HeartPulse,
  },
  {
    to: '/symptoms',
    labelKey: 'home.symptoms',
    icon: CircleAlert,
  },
] as const satisfies ReadonlyArray<{
  to: string;
  labelKey: TranslationKey;
  icon: typeof PawPrint;
}>;

export function HomePage() {
  const { t } = useI18n();
  const { activeDog, activeDogId, areDogsLoading, dogs, setActiveDogId } = useActiveDog();
  const { data: heatCycles = [] } = useHeatCyclesQuery(activeDogId);
  const { data: healthEvents = [] } = useHealthEventsQuery(activeDogId);
  const calendarEvents = buildCalendarEvents({
    heatCycles,
    healthEvents,
  });
  const nextEvent = getNextCalendarEvent(calendarEvents);

  return (
    <div className="space-y-5 lg:space-y-6">
      <InfoCard className="bg-[var(--app-accent-soft)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--app-muted)]">{t('home.activeDog')}</p>
            {dogs.length > 1 ? (
              <div className="mt-2">
                <select
                  aria-label={t('home.activeDog')}
                  className="min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-lg font-semibold outline-none focus:border-[var(--app-link)]"
                  id="home-active-dog"
                  value={activeDogId ?? ''}
                  onChange={(event) => setActiveDogId(event.target.value || null)}
                >
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h2 className="mt-1 text-2xl font-semibold">
                {activeDog ? activeDog.name : t('home.noActiveDog')}
              </h2>
            )}
            <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
              {activeDog || areDogsLoading
                ? t('home.activeDogDescription')
                : t('home.addPetDescription')}
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--app-button)] text-[var(--app-button-text)]">
            <PawPrint size={26} />
          </div>
        </div>
      </InfoCard>

      <section>
        <SectionHeader title={t('home.quickActions')} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                className="flex min-h-24 flex-col justify-between rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-4 transition hover:bg-[var(--app-surface)]"
                key={action.to}
                to={action.to}
              >
                <Icon size={22} className="text-[var(--app-link)]" />
                <span className="text-sm font-semibold">{t(action.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader
          title={t('home.nextEvent')}
          action={t('common.calendar')}
          actionTo="/calendar"
        />
        <InfoCard>
          {nextEvent ? (
            <NextEventCardContent event={nextEvent} />
          ) : (
            <>
              <p className="text-sm font-semibold">{t('home.noScheduledEvents')}</p>
              <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
                {t('home.scheduledEventsDescription')}
              </p>
            </>
          )}
        </InfoCard>
      </section>
    </div>
  );
}

interface NextEventCardContentProps {
  event: CalendarEventItem;
}

function NextEventCardContent({ event }: NextEventCardContentProps) {
  const { t } = useI18n();
  const typeLabel = getCalendarEventTypeLabel(event, t);
  const shouldShowTypeLabel = typeLabel !== event.title;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold">{event.title}</p>
        {shouldShowTypeLabel ? (
          <span className="rounded-full bg-[var(--app-link-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--app-link)]">
            {typeLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-[var(--app-muted)]">{formatCalendarEventDate(event, t)}</p>
      {event.description ? (
        <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">{event.description}</p>
      ) : null}
    </div>
  );
}

function getNextCalendarEvent(events: CalendarEventItem[]): CalendarEventItem | null {
  const today = getTodayDate();
  const upcomingEvents = events
    .filter((event) => getCalendarEventRelevantDate(event) >= today)
    .sort((firstEvent, secondEvent) =>
      getCalendarEventRelevantDate(firstEvent).localeCompare(
        getCalendarEventRelevantDate(secondEvent),
      ),
    );
  const scheduledUpcomingEvent = upcomingEvents.find((event) => !isActiveHeatCycleEvent(event));

  return scheduledUpcomingEvent ?? upcomingEvents[0] ?? null;
}

function getCalendarEventRelevantDate(event: CalendarEventItem): string {
  return event.displayEndDate ?? event.endDate ?? event.date;
}

function isActiveHeatCycleEvent(event: CalendarEventItem): boolean {
  return event.kind === 'heatCycle' && !event.endDate && Boolean(event.displayEndDate);
}

function getCalendarEventTypeLabel(
  event: CalendarEventItem,
  t: ReturnType<typeof useI18n>['t'],
): string {
  if (event.kind === 'heatCycle') {
    return t('calendar.heatCycleEvent');
  }

  if (event.kind === 'predictedHeatCycle') {
    return t('calendar.predictedHeatCycleEvent');
  }

  if (event.kind === 'reminder') {
    return t('calendar.reminderEvent');
  }

  return event.shortTitleKey ? t(event.shortTitleKey) : t('calendar.shortOther');
}

function formatCalendarEventDate(
  event: CalendarEventItem,
  t: ReturnType<typeof useI18n>['t'],
): string {
  if (event.kind === 'heatCycle' && !event.endDate && event.displayEndDate) {
    return `${t('heatCycles.startDate')}: ${formatDate(event.date)} · ${t(
      'heatCycles.activeStatus',
    )}`;
  }

  const endDate = event.displayEndDate ?? event.endDate;

  if (!endDate || endDate === event.date) {
    return formatDate(event.date);
  }

  return `${formatDate(event.date)} — ${formatDate(endDate)}`;
}

function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split('-');

  return `${day}.${month}.${year}`;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
