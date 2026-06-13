import { HeartPulse, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { HealthEventRecord } from '../../api/types.js';
import { ActiveDogSelect } from '../../dogs/components/ActiveDogSelect.js';
import { useActiveDog } from '../../dogs/useActiveDog.js';
import { CreateHealthEventForm } from '../../healthEvents/components/CreateHealthEventForm.js';
import { EditHealthEventForm } from '../../healthEvents/components/EditHealthEventForm.js';
import {
  getHealthEventTypeBadgeClassName,
  getHealthEventTypeLabelKey,
} from '../../healthEvents/healthEventTypes.js';
import { useDeleteHealthEventMutation } from '../../healthEvents/useDeleteHealthEventMutation.js';
import { useHealthEventsQuery } from '../../healthEvents/useHealthEventsQuery.js';
import { formatFullDate } from '../../heatCycles/heatCycleInsights.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function HealthPage() {
  const { t } = useI18n();
  const { activeDogId, areDogsLoading, dogs } = useActiveDog();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingHealthEventId, setEditingHealthEventId] = useState<string | null>(null);
  const {
    data: healthEvents = [],
    isLoading: areHealthEventsLoading,
    error: healthEventsError,
  } = useHealthEventsQuery(activeDogId);
  const deleteHealthEventMutation = useDeleteHealthEventMutation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('healthPage.title')}</h2>
        {activeDogId ? (
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setEditingHealthEventId(null);
              setIsCreateFormOpen(true);
            }}
          >
            <Plus size={18} />
            <span>{t('healthPage.addRecord')}</span>
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
          <HeartPulse className="text-[var(--app-link)]" size={24} />
          <p className="mt-3 font-semibold">{t('healthPage.noDogsTitle')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('healthPage.noDogsDescription')}
          </p>
        </InfoCard>
      ) : null}

      {dogs.length > 0 ? (
        <InfoCard>
          <ActiveDogSelect id="health-event-dog" label={t('healthPage.dog')} />
        </InfoCard>
      ) : null}

      {activeDogId && areHealthEventsLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('healthPage.loading')}</p>
        </InfoCard>
      ) : null}

      {activeDogId && healthEventsError ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('healthPage.loadError')}</p>
        </InfoCard>
      ) : null}

      {activeDogId && isCreateFormOpen ? (
        <CreateHealthEventForm
          dogId={activeDogId}
          onCancel={() => setIsCreateFormOpen(false)}
          onCreated={() => setIsCreateFormOpen(false)}
        />
      ) : null}

      {activeDogId &&
      !isCreateFormOpen &&
      !areHealthEventsLoading &&
      !healthEventsError &&
      healthEvents.length === 0 ? (
        <InfoCard>
          <HeartPulse className="text-[var(--app-link)]" size={24} />
          <p className="mt-3 font-semibold">{t('healthPage.emptyTitle')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('healthPage.emptyDescription')}
          </p>
        </InfoCard>
      ) : null}

      {activeDogId && healthEvents.length > 0 ? (
        <div className="space-y-3">
          {healthEvents.map((healthEvent) =>
            editingHealthEventId === healthEvent.id ? (
              <EditHealthEventForm
                key={healthEvent.id}
                healthEvent={healthEvent}
                onCancel={() => setEditingHealthEventId(null)}
                onUpdated={() => setEditingHealthEventId(null)}
              />
            ) : (
              <HealthEventCard
                key={healthEvent.id}
                healthEvent={healthEvent}
                isDeleting={deleteHealthEventMutation.isPending}
                onEdit={() => {
                  setIsCreateFormOpen(false);
                  setEditingHealthEventId(healthEvent.id);
                }}
                onDelete={() => {
                  if (!window.confirm(t('healthPage.deleteConfirm'))) {
                    return;
                  }

                  deleteHealthEventMutation.mutate({
                    dogId: activeDogId,
                    healthEventId: healthEvent.id,
                  });
                }}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

interface HealthEventCardProps {
  healthEvent: HealthEventRecord;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function HealthEventCard({ healthEvent, isDeleting, onEdit, onDelete }: HealthEventCardProps) {
  const { t } = useI18n();

  return (
    <InfoCard>
      <div className="space-y-3">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <span
              className={[
                'inline-flex min-h-7 max-w-full items-center rounded-full px-2.5 text-[11px] font-semibold ring-1',
                getHealthEventTypeBadgeClassName(healthEvent.type),
              ].join(' ')}
            >
              {t(getHealthEventTypeLabelKey(healthEvent.type))}
            </span>
            <span className="shrink-0 text-xs font-medium text-[var(--app-muted)]">
              {formatFullDate(healthEvent.eventDate)}
            </span>
          </div>
          <p className="mt-2 font-semibold">{healthEvent.title}</p>
          {healthEvent.nextReminderDate ? (
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              {t('healthPage.nextReminderDate')}: {formatFullDate(healthEvent.nextReminderDate)}
            </p>
          ) : null}
        </div>

        {healthEvent.notes ? (
          <p className="rounded-lg bg-[var(--app-surface)] px-3 py-2 text-sm leading-5 text-[var(--app-muted)]">
            {healthEvent.notes}
          </p>
        ) : null}

        <div className="flex justify-end gap-2 border-t border-[var(--app-border)] pt-3">
          <button
            aria-label={t('healthPage.edit')}
            className="icon-button text-[var(--app-link)]"
            type="button"
            onClick={onEdit}
          >
            <Pencil size={18} />
          </button>
          <button
            aria-label={t('healthPage.delete')}
            className="icon-button text-red-500"
            disabled={isDeleting}
            type="button"
            onClick={onDelete}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </InfoCard>
  );
}
