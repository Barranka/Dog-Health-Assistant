import { useState, type FormEvent } from 'react';

import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../../presentation/components/InfoCard.js';
import { useCreateHeatCycleMutation } from '../useCreateHeatCycleMutation.js';

interface CreateHeatCycleFormProps {
  dogId: string;
  onCancel: () => void;
  onCreated: () => void;
}

export function CreateHeatCycleForm({ dogId, onCancel, onCreated }: CreateHeatCycleFormProps) {
  const { t } = useI18n();
  const createHeatCycleMutation = useCreateHeatCycleMutation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!startDate) {
      return;
    }

    try {
      await createHeatCycleMutation.mutateAsync({
        dogId,
        payload: {
          startDate,
          endDate: endDate || null,
          notes: notes.trim() || null,
        },
      });

      setStartDate('');
      setEndDate('');
      setNotes('');
      onCreated();
    } catch {
      // Error state is handled by createHeatCycleMutation.error.
    }
  }

  return (
    <InfoCard>
      <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block text-sm font-medium" htmlFor="heat-cycle-start-date">
          {t('heatCycles.startDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="heat-cycle-start-date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor="heat-cycle-end-date">
          {t('heatCycles.endDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="heat-cycle-end-date"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor="heat-cycle-notes">
          {t('heatCycles.notes')}
        </label>
        <textarea
          className="min-h-24 w-full resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="heat-cycle-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {createHeatCycleMutation.error ? (
          <p className="text-sm text-red-500">{t('heatCycles.createError')}</p>
        ) : null}

        <div className="flex gap-2">
          <button
            className="primary-button flex-1 justify-center"
            type="submit"
            disabled={createHeatCycleMutation.isPending}
          >
            {createHeatCycleMutation.isPending ? t('heatCycles.creating') : t('common.add')}
          </button>
          <button
            className="icon-button min-w-24 px-3 text-sm font-semibold"
            type="button"
            disabled={createHeatCycleMutation.isPending}
            onClick={onCancel}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
