import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

import { buildCalendarEvents } from '../../calendar/buildCalendarEvents.js';
import { CalendarEventList } from '../../calendar/components/CalendarEventList.js';
import { HealthCalendar } from '../../calendar/components/HealthCalendar.js';
import { ActiveDogSelect } from '../../dogs/components/ActiveDogSelect.js';
import { useActiveDog } from '../../dogs/useActiveDog.js';
import { useHealthEventsQuery } from '../../healthEvents/useHealthEventsQuery.js';
import { useHeatCyclesQuery } from '../../heatCycles/useHeatCyclesQuery.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function CalendarPage() {
  const { t } = useI18n();
  const { activeDogId, areDogsLoading, dogs } = useActiveDog();
  const [view, setView] = useState<'month' | 'list'>('month');

  const {
    data: heatCycles = [],
    isLoading: areHeatCyclesLoading,
    error: heatCyclesError,
  } = useHeatCyclesQuery(activeDogId);

  const {
    data: healthEvents = [],
    isLoading: areHealthEventsLoading,
    error: healthEventsError,
  } = useHealthEventsQuery(activeDogId);

  const calendarEvents = buildCalendarEvents({
    heatCycles,
    healthEvents,
  });

  const isLoading = areDogsLoading || areHeatCyclesLoading || areHealthEventsLoading;
  const hasError = Boolean(heatCyclesError || healthEventsError);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('calendar.title')}</h2>

      {areDogsLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('dogs.loading')}</p>
        </InfoCard>
      ) : null}

      {!areDogsLoading && dogs.length === 0 ? (
        <InfoCard>
          <CalendarDays className="text-[var(--app-link)]" size={24} />
          <p className="mt-3 font-semibold">{t('calendar.noDogsTitle')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('calendar.noDogsDescription')}
          </p>
        </InfoCard>
      ) : null}

      {dogs.length > 0 ? (
        <InfoCard>
          <ActiveDogSelect id="calendar-dog" label={t('calendar.dog')} />
        </InfoCard>
      ) : null}

      {activeDogId && isLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('calendar.loading')}</p>
        </InfoCard>
      ) : null}

      {activeDogId && hasError ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('calendar.loadError')}</p>
        </InfoCard>
      ) : null}

      {activeDogId && !isLoading && !hasError && calendarEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-1">
            <button
              className={[
                'min-h-10 rounded-md text-sm font-semibold',
                view === 'month'
                  ? 'bg-[var(--app-button)] text-[var(--app-button-text)]'
                  : 'text-[var(--app-muted)]',
              ].join(' ')}
              type="button"
              onClick={() => setView('month')}
            >
              {t('calendar.monthView')}
            </button>
            <button
              className={[
                'min-h-10 rounded-md text-sm font-semibold',
                view === 'list'
                  ? 'bg-[var(--app-button)] text-[var(--app-button-text)]'
                  : 'text-[var(--app-muted)]',
              ].join(' ')}
              type="button"
              onClick={() => setView('list')}
            >
              {t('calendar.listView')}
            </button>
          </div>
          {view === 'month' ? (
            <HealthCalendar events={calendarEvents} />
          ) : (
            <CalendarEventList events={calendarEvents} />
          )}
        </>
      ) : null}

      {activeDogId && !isLoading && !hasError && calendarEvents.length === 0 ? (
        <InfoCard>
          <CalendarDays className="text-[var(--app-link)]" size={24} />
          <p className="mt-3 font-semibold">{t('calendar.emptyTitle')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('calendar.emptyDescription')}
          </p>
        </InfoCard>
      ) : null}
    </div>
  );
}
