import { useState, type FormEvent } from 'react';

import type { HeatCycleRecord } from '../../api/types.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../../presentation/components/InfoCard.js';
import { useUpdateHeatCycleMutation } from '../useUpdateHeatCycleMutation.js';

interface EditHeatCycleFormProps {
  cycle: HeatCycleRecord;
  onCancel: () => void;
  onUpdated: () => void;
}

export function EditHeatCycleForm({ cycle, onCancel, onUpdated }: EditHeatCycleFormProps) {
  const { t } = useI18n();
  const updateHeatCycleMutation = useUpdateHeatCycleMutation();
  const [startDate, setStartDate] = useState(cycle.startDate.slice(0, 10));
  const [endDate, setEndDate] = useState(cycle.endDate ? cycle.endDate.slice(0, 10) : '');
  const [notes, setNotes] = useState(cycle.notes ?? '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!startDate) {
      return;
    }

    try {
      await updateHeatCycleMutation.mutateAsync({
        dogId: cycle.dogId,
        heatCycleId: cycle.id,
        payload: {
          startDate,
          endDate: endDate || null,
          notes: notes.trim() || null,
        },
      });

      onUpdated();
    } catch {
      // Error state is handled by updateHeatCycleMutation.error.
    }
  }

  return (
    <InfoCard>
      <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block text-sm font-medium" htmlFor={`heat-cycle-start-date-${cycle.id}`}>
          {t('heatCycles.startDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`heat-cycle-start-date-${cycle.id}`}
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor={`heat-cycle-end-date-${cycle.id}`}>
          {t('heatCycles.endDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`heat-cycle-end-date-${cycle.id}`}
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor={`heat-cycle-notes-${cycle.id}`}>
          {t('heatCycles.notes')}
        </label>
        <textarea
          className="min-h-24 w-full resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`heat-cycle-notes-${cycle.id}`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {updateHeatCycleMutation.error ? (
          <p className="text-sm text-red-500">{t('heatCycles.updateError')}</p>
        ) : null}

        <div className="flex gap-2">
          <button
            className="primary-button flex-1 justify-center"
            type="submit"
            disabled={updateHeatCycleMutation.isPending}
          >
            {updateHeatCycleMutation.isPending ? t('heatCycles.saving') : t('common.save')}
          </button>
          <button
            className="icon-button min-w-24 px-3 text-sm font-semibold"
            type="button"
            disabled={updateHeatCycleMutation.isPending}
            onClick={onCancel}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
