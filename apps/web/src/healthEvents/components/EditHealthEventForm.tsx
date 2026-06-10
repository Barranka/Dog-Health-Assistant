import { useState, type FormEvent } from 'react';

import type { HealthEventRecord, HealthEventType } from '../../api/types.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../../presentation/components/InfoCard.js';
import { getHealthEventTypeLabelKey, healthEventTypes } from '../healthEventTypes.js';
import { useUpdateHealthEventMutation } from '../useUpdateHealthEventMutation.js';

interface EditHealthEventFormProps {
  healthEvent: HealthEventRecord;
  onCancel: () => void;
  onUpdated: () => void;
}

export function EditHealthEventForm({
  healthEvent,
  onCancel,
  onUpdated,
}: EditHealthEventFormProps) {
  const { t } = useI18n();
  const updateHealthEventMutation = useUpdateHealthEventMutation();
  const [type, setType] = useState<HealthEventType>(healthEvent.type);
  const [title, setTitle] = useState(healthEvent.title);
  const [eventDate, setEventDate] = useState(healthEvent.eventDate.slice(0, 10));
  const [nextReminderDate, setNextReminderDate] = useState(
    healthEvent.nextReminderDate ? healthEvent.nextReminderDate.slice(0, 10) : '',
  );
  const [notes, setNotes] = useState(healthEvent.notes ?? '');
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
      await updateHealthEventMutation.mutateAsync({
        dogId: healthEvent.dogId,
        healthEventId: healthEvent.id,
        payload: {
          type,
          title: title.trim(),
          eventDate,
          nextReminderDate: nextReminderDate || null,
          notes: notes.trim() || null,
        },
      });

      onUpdated();
    } catch {
      // Error state is handled by updateHealthEventMutation.error.
    }
  }

  return (
    <InfoCard>
      <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label
          className="block text-sm font-medium"
          htmlFor={`health-event-type-${healthEvent.id}`}
        >
          {t('healthPage.type')}
        </label>
        <select
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`health-event-type-${healthEvent.id}`}
          value={type}
          onChange={(event) => setType(event.target.value as HealthEventType)}
        >
          {healthEventTypes.map((healthEventType) => (
            <option key={healthEventType} value={healthEventType}>
              {t(getHealthEventTypeLabelKey(healthEventType))}
            </option>
          ))}
        </select>

        <label
          className="block text-sm font-medium"
          htmlFor={`health-event-title-${healthEvent.id}`}
        >
          {t('healthPage.recordTitle')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`health-event-title-${healthEvent.id}`}
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setValidationError(null);
          }}
        />

        <label
          className="block text-sm font-medium"
          htmlFor={`health-event-date-${healthEvent.id}`}
        >
          {t('healthPage.eventDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`health-event-date-${healthEvent.id}`}
          type="date"
          value={eventDate}
          onChange={(event) => {
            setEventDate(event.target.value);
            setValidationError(null);
          }}
        />

        <label
          className="block text-sm font-medium"
          htmlFor={`health-event-next-reminder-date-${healthEvent.id}`}
        >
          {t('healthPage.nextReminderDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`health-event-next-reminder-date-${healthEvent.id}`}
          type="date"
          value={nextReminderDate}
          onChange={(event) => setNextReminderDate(event.target.value)}
        />

        <label
          className="block text-sm font-medium"
          htmlFor={`health-event-notes-${healthEvent.id}`}
        >
          {t('healthPage.notes')}
        </label>
        <textarea
          className="min-h-24 w-full resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`health-event-notes-${healthEvent.id}`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {updateHealthEventMutation.error ? (
          <p className="text-sm text-red-500">{t('healthPage.updateError')}</p>
        ) : null}

        {validationError ? <p className="text-sm text-red-500">{validationError}</p> : null}

        <div className="flex gap-2">
          <button
            className="primary-button flex-1 justify-center"
            type="submit"
            disabled={updateHealthEventMutation.isPending}
          >
            {updateHealthEventMutation.isPending ? t('healthPage.saving') : t('common.save')}
          </button>
          <button
            className="icon-button min-w-24 px-3 text-sm font-semibold"
            type="button"
            disabled={updateHealthEventMutation.isPending}
            onClick={onCancel}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
