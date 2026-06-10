import { PawPrint, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { CreateDogForm } from '../../dogs/components/CreateDogForm.js';
import { useDeleteDogMutation } from '../../dogs/useDeleteDogMutation.js';
import { useDogsQuery } from '../../dogs/useDogsQuery.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function DogsPage() {
  const { t } = useI18n();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const { data: dogs = [], isLoading: areDogsLoading, error } = useDogsQuery();
  const deleteDogMutation = useDeleteDogMutation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('dogs.title')}</h2>
        <button className="primary-button" type="button" onClick={() => setIsCreateFormOpen(true)}>
          <Plus size={18} />
          <span>{t('common.add')}</span>
        </button>
      </div>

      {isCreateFormOpen ? (
        <CreateDogForm
          onCancel={() => setIsCreateFormOpen(false)}
          onCreated={() => setIsCreateFormOpen(false)}
        />
      ) : null}

      {areDogsLoading ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('dogs.loading')}</p>
        </InfoCard>
      ) : null}

      {error ? (
        <InfoCard>
          <p className="text-sm text-[var(--app-muted)]">{t('dogs.loadError')}</p>
        </InfoCard>
      ) : null}

      {!areDogsLoading && !error && dogs.length === 0 ? (
        <InfoCard>
          <div className="flex items-start gap-3">
            <PawPrint className="mt-1 text-[var(--app-link)]" size={24} />
            <div>
              <p className="font-semibold">{t('dogs.emptyTitle')}</p>
              <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
                {t('dogs.emptyDescription')}
              </p>
            </div>
          </div>
        </InfoCard>
      ) : null}

      {dogs.length > 0 ? (
        <div className="space-y-3">
          {dogs.map((dog) => (
            <InfoCard key={dog.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{dog.name}</p>
                  <p className="mt-1 text-sm text-[var(--app-muted)]">{dog.breed ?? dog.sex}</p>
                </div>
                <button
                  aria-label={t('dogs.delete')}
                  className="icon-button shrink-0 text-red-500"
                  disabled={deleteDogMutation.isPending}
                  type="button"
                  onClick={() => deleteDogMutation.mutate(dog.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </InfoCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}
