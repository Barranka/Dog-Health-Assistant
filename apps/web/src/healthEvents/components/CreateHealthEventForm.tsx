import { useState, type FormEvent } from 'react';

import type { HealthEventType } from '../../api/types.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../../presentation/components/InfoCard.js';
import { getHealthEventTypeLabelKey, healthEventTypes } from '../healthEventTypes.js';
import { useCreateHealthEventMutation } from '../useCreateHealthEventMutation.js';

interface CreateHealthEventFormProps {
  dogId: string;
  onCancel: () => void;
  onCreated: () => void;
}

export function CreateHealthEventForm({ dogId, onCancel, onCreated }: CreateHealthEventFormProps) {
  const { t } = useI18n();
  const createHealthEventMutation = useCreateHealthEventMutation();
  const [type, setType] = useState<HealthEventType>('vaccination');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [nextReminderDate, setNextReminderDate] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setValidationError(t('healthPage.titleRequired'));
      return;
    }

    if (!eventDate) {
      setValidationError(t('healthPage.eventDateRequired'));
      return;
    }

    setValidationError(null);

    try {
      await createHealthEventMutation.mutateAsync({
        dogId,
        payload: {
          type,
          title: title.trim(),
          eventDate,
          nextReminderDate: nextReminderDate || null,
          notes: notes.trim() || null,
        },
      });

      setType('vaccination');
      setTitle('');
      setEventDate('');
      setNextReminderDate('');
      setNotes('');
      setValidationError(null);
      onCreated();
    } catch {
      // Error state is handled by createHealthEventMutation.error.
    }
  }

  return (
    <InfoCard>
      <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block text-sm font-medium" htmlFor="health-event-type">
          {t('healthPage.type')}
        </label>
        <select
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="health-event-type"
          value={type}
          onChange={(event) => setType(event.target.value as HealthEventType)}
        >
          {healthEventTypes.map((healthEventType) => (
            <option key={healthEventType} value={healthEventType}>
              {t(getHealthEventTypeLabelKey(healthEventType))}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium" htmlFor="health-event-title">
          {t('healthPage.recordTitle')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="health-event-title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setValidationError(null);
          }}
        />

        <label className="block text-sm font-medium" htmlFor="health-event-date">
          {t('healthPage.eventDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="health-event-date"
          type="date"
          value={eventDate}
          onChange={(event) => {
            setEventDate(event.target.value);
            setValidationError(null);
          }}
        />

        <label className="block text-sm font-medium" htmlFor="health-event-next-reminder-date">
          {t('healthPage.nextReminderDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="health-event-next-reminder-date"
          type="date"
          value={nextReminderDate}
          onChange={(event) => setNextReminderDate(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor="health-event-notes">
          {t('healthPage.notes')}
        </label>
        <textarea
          className="min-h-24 w-full resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id="health-event-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {createHealthEventMutation.error ? (
          <p className="text-sm text-red-500">{t('healthPage.createError')}</p>
        ) : null}

        {validationError ? <p className="text-sm text-red-500">{validationError}</p> : null}

        <div className="flex gap-2">
          <button
            className="primary-button flex-1 justify-center"
            type="submit"
            disabled={createHealthEventMutation.isPending}
          >
            {createHealthEventMutation.isPending ? t('healthPage.creating') : t('common.add')}
          </button>
          <button
            className="icon-button min-w-24 px-3 text-sm font-semibold"
            type="button"
            disabled={createHealthEventMutation.isPending}
            onClick={onCancel}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
