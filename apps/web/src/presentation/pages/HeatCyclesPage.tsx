import { CalendarPlus, Info, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CreateHeatCycleForm } from '../../heatCycles/components/CreateHeatCycleForm.js';
import { EditHeatCycleForm } from '../../heatCycles/components/EditHeatCycleForm.js';
import {
  type CycleAnalytics,
  formatDate,
  formatDayMonth,
  formatFullDate,
  getCycleAnalytics,
} from '../../heatCycles/heatCycleInsights.js';
import { useDeleteHeatCycleMutation } from '../../heatCycles/useDeleteHeatCycleMutation.js';
import { useHeatCyclesQuery } from '../../heatCycles/useHeatCyclesQuery.js';
import { useDogsQuery } from '../../dogs/useDogsQuery.js';
import type { TranslationKey } from '../../i18n/dictionaries.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function HeatCyclesPage() {
  const { t } = useI18n();
  const { data: dogs = [], isLoading: areDogsLoading } = useDogsQuery();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingHeatCycleId, setEditingHeatCycleId] = useState<string | null>(null);

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
  const deleteHeatCycleMutation = useDeleteHeatCycleMutation();
  const cycleAnalytics = getCycleAnalytics(heatCycles);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('heatCycles.title')}</h2>
        {selectedDogId ? (
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setEditingHeatCycleId(null);
              setIsCreateFormOpen(true);
            }}
          >
            <CalendarPlus size={18} />
            <span>{t('common.add')}</span>
          </button>
        ) : null}
      </div>

      {areDogsLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('dogs.loading')}</p>
        </InfoCard>
      ) : null}

      {!areDogsLoading && dogs.length === 0 ? (
        <InfoCard>
          <CalendarPlus className="text-[var(--app-link)]" size={24} />
          <p className="mt-3 font-semibold">{t('heatCycles.noDogsTitle')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('heatCycles.noDogsDescription')}
          </p>
        </InfoCard>
      ) : null}

      {dogs.length > 0 ? (
        <InfoCard>
          <label className="block text-sm font-medium" htmlFor="heat-cycle-dog">
            {t('heatCycles.dog')}
          </label>
          <select
            className="mt-2 min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
            id="heat-cycle-dog"
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
      {selectedDogId && areHeatCyclesLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('heatCycles.loading')}</p>
        </InfoCard>
      ) : null}

      {selectedDogId && heatCyclesError ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('heatCycles.loadError')}</p>
        </InfoCard>
      ) : null}

      {selectedDogId && isCreateFormOpen ? (
        <CreateHeatCycleForm
          dogId={selectedDogId}
          onCancel={() => setIsCreateFormOpen(false)}
          onCreated={() => setIsCreateFormOpen(false)}
        />
      ) : null}

      {cycleAnalytics ? <ReproductiveCycleSummary analytics={cycleAnalytics} /> : null}

      {selectedDogId &&
      !isCreateFormOpen &&
      !areHeatCyclesLoading &&
      !heatCyclesError &&
      heatCycles.length === 0 ? (
        <InfoCard>
          <CalendarPlus className="text-[var(--app-link)]" size={24} />
          <p className="mt-3 font-semibold">{t('heatCycles.emptyTitle')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('heatCycles.emptyDescription')}
          </p>
        </InfoCard>
      ) : null}

      {selectedDogId && heatCycles.length > 0 ? (
        <div className="space-y-3">
          {heatCycles.map((cycle) =>
            editingHeatCycleId === cycle.id ? (
              <EditHeatCycleForm
                key={cycle.id}
                cycle={cycle}
                onCancel={() => setEditingHeatCycleId(null)}
                onUpdated={() => setEditingHeatCycleId(null)}
              />
            ) : (
              <InfoCard key={cycle.id}>
                <div className="space-y-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {formatFullDate(cycle.startDate)}
                        {cycle.endDate ? ` — ${formatFullDate(cycle.endDate)}` : ''}
                      </p>
                      <span
                        className={[
                          'inline-flex min-h-7 max-w-full items-center rounded-full px-2.5 text-[11px] font-semibold',
                          cycle.status === 'active'
                            ? 'bg-[var(--app-accent-soft)] text-[var(--app-link)]'
                            : 'bg-[var(--app-surface)] text-[var(--app-muted)]',
                        ].join(' ')}
                      >
                        {cycle.status === 'active'
                          ? t('heatCycles.activeStatus')
                          : t('heatCycles.completedStatus')}
                      </span>
                    </div>
                  </div>

                  {cycle.status === 'completed' ? (
                    <p className="text-sm text-[var(--app-muted)]">
                      {cycle.duration
                        ? `${t('heatCycles.duration')}: ${cycle.duration}`
                        : t('heatCycles.completedStatus')}
                    </p>
                  ) : null}

                  {cycle.notes ? (
                    <p className="text-sm text-[var(--app-muted)]">{cycle.notes}</p>
                  ) : null}

                  <div className="flex justify-end gap-2 border-t border-[var(--app-border)] pt-3">
                    <button
                      aria-label={t('heatCycles.edit')}
                      className="icon-button text-[var(--app-link)]"
                      type="button"
                      onClick={() => {
                        setIsCreateFormOpen(false);
                        setEditingHeatCycleId(cycle.id);
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      aria-label={t('heatCycles.delete')}
                      className="icon-button text-red-500"
                      disabled={deleteHeatCycleMutation.isPending}
                      type="button"
                      onClick={() => {
                        if (!window.confirm(t('heatCycles.deleteConfirm'))) {
                          return;
                        }

                        deleteHeatCycleMutation.mutate({
                          dogId: selectedDogId,
                          heatCycleId: cycle.id,
                        });
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </InfoCard>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

interface ReproductiveCycleSummaryProps {
  analytics: CycleAnalytics;
}

function ReproductiveCycleSummary({ analytics }: ReproductiveCycleSummaryProps) {
  const { t } = useI18n();
  const activeForecast = analytics.activeEndForecastRange
    ? `${formatDayMonth(analytics.activeEndForecastRange.from)} — ${formatDayMonth(
        analytics.activeEndForecastRange.to,
      )}`
    : null;
  const nextHeatText = analytics.nextHeatEstimatedAt
    ? getNextHeatText(analytics.nextHeatEstimatedAt, t)
    : null;

  return (
    <InfoCard>
      <div>
        <p className="text-sm font-semibold text-[var(--app-muted)]">
          {t('heatCycles.reproductiveCycleTitle')}
        </p>
        <h3 className="mt-1 text-lg font-semibold">
          {analytics.lastHeatEndDate
            ? t(analytics.phaseLabelKey)
            : t('heatCycles.activeHeatPeriod')}
        </h3>
        <p className="mt-1 text-xs text-[var(--app-muted)]">
          {t('heatCycles.medicalPhase')}: {t(analytics.phaseMedicalNameKey)}
        </p>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <CycleMetric label={t('heatCycles.cycleDay')} value={analytics.cycleDay.toString()} />
        <CycleMetric
          label={
            analytics.nextHeatEstimatedAt
              ? t('heatCycles.nextHeatExpectedAt')
              : t('heatCycles.estimatedEnd')
          }
          value={
            analytics.nextHeatEstimatedAt
              ? formatDate(analytics.nextHeatEstimatedAt)
              : (activeForecast ?? t('heatCycles.afterActiveHeat'))
          }
        />
      </div>

      {analytics.daysAfterHeatEnd !== null ? (
        <p className="mt-3 text-sm text-[var(--app-muted)]">
          {t('heatCycles.daysAfterHeatEnd')}: {analytics.daysAfterHeatEnd}
        </p>
      ) : null}

      {nextHeatText ? (
        <p className="mt-3 text-sm font-medium">
          {t('heatCycles.nextHeatEstimate')}: {nextHeatText}
        </p>
      ) : null}

      <p className="mt-3 text-sm leading-5 text-[var(--app-muted)]">
        {t(analytics.phaseDescriptionKey)}
      </p>

      <p className="mt-3 flex items-start gap-2 rounded-lg bg-[var(--app-surface)] px-3 py-2 text-xs leading-5 text-[var(--app-muted)]">
        <Info className="mt-0.5 shrink-0" size={14} aria-hidden="true" />
        <span>{t('heatCycles.disclaimer')}</span>
      </p>
    </InfoCard>
  );
}

interface CycleMetricProps {
  label: string;
  value: string;
}

function CycleMetric({ label, value }: CycleMetricProps) {
  return (
    <div className="rounded-lg bg-[var(--app-surface)] px-3 py-2">
      <p className="text-xs text-[var(--app-muted)]">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function getNextHeatText(nextHeatEstimatedAt: Date, t: (key: TranslationKey) => string): string {
  const daysUntilNextHeat = Math.ceil(
    (nextHeatEstimatedAt.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000),
  );

  if (daysUntilNextHeat <= 0) {
    return t('heatCycles.nextHeatAroundNow');
  }

  const monthsUntilNextHeat = Math.max(1, Math.round(daysUntilNextHeat / 30));

  return `${t('heatCycles.inAbout')} ${monthsUntilNextHeat} ${t('heatCycles.monthsShort')}`;
}
