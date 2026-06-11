import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';

import { buildCalendarEvents } from '../../calendar/buildCalendarEvents.js';
import { CalendarEventList } from '../../calendar/components/CalendarEventList.js';
import { HealthCalendar } from '../../calendar/components/HealthCalendar.js';
import { useDogsQuery } from '../../dogs/useDogsQuery.js';
import { useHealthEventsQuery } from '../../healthEvents/useHealthEventsQuery.js';
import { useHeatCyclesQuery } from '../../heatCycles/useHeatCyclesQuery.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function CalendarPage() {
  const { t } = useI18n();
  const { data: dogs = [], isLoading: areDogsLoading } = useDogsQuery();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'list'>('month');

  useEffect(() => {
    if (!selectedDogId && dogs[0]) {
      setSelectedDogId(dogs[0].id);
    }
  }, [dogs, selectedDogId]);

  const {
    data: heatCycles = [],
    isLoading: areHeatCyclesLoading,
    error: heatCyclesError,
  } = useHeatCyclesQuery(selectedDogId);

  const {
    data: healthEvents = [],
    isLoading: areHealthEventsLoading,
    error: healthEventsError,
  } = useHealthEventsQuery(selectedDogId);

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
          <label className="block text-sm font-medium" htmlFor="calendar-dog">
            {t('calendar.dog')}
          </label>
          <select
            className="mt-2 min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
            id="calendar-dog"
            value={selectedDogId ?? ''}
            onChange={(event) => setSelectedDogId(event.target.value)}
          >
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>
                {dog.name}
              </option>
            ))}
          </select>
        </InfoCard>
      ) : null}

      {selectedDogId && isLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('calendar.loading')}</p>
        </InfoCard>
      ) : null}

      {selectedDogId && hasError ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('calendar.loadError')}</p>
        </InfoCard>
      ) : null}

      {selectedDogId && !isLoading && !hasError && calendarEvents.length > 0 ? (
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

      {selectedDogId && !isLoading && !hasError && calendarEvents.length === 0 ? (
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
