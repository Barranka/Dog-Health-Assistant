import { Mars, PawPrint, Pencil, Plus, Trash2, Venus } from 'lucide-react';
import { useState } from 'react';

import { CreateDogForm } from '../../dogs/components/CreateDogForm.js';
import { EditDogForm } from '../../dogs/components/EditDogForm.js';
import { useDeleteDogMutation } from '../../dogs/useDeleteDogMutation.js';
import { useDogsQuery } from '../../dogs/useDogsQuery.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function DogsPage() {
  const { locale, t } = useI18n();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const { data: dogs = [], isLoading: areDogsLoading, error } = useDogsQuery();
  const deleteDogMutation = useDeleteDogMutation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('dogs.title')}</h2>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setEditingDogId(null);
            setIsCreateFormOpen(true);
          }}
        >
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
          {dogs.map((dog) =>
            editingDogId === dog.id ? (
              <EditDogForm
                key={dog.id}
                dog={dog}
                onCancel={() => setEditingDogId(null)}
                onUpdated={() => setEditingDogId(null)}
              />
            ) : (
              <InfoCard key={dog.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {(() => {
                      const ageLabel = formatDogAge(dog.birthDate, locale);

                      return (
                        <>
                          <div className="flex min-w-0 items-center gap-2 text-sm leading-6 text-[var(--app-muted)]">
                            <p className="min-w-0 truncate text-base font-semibold text-[var(--app-text)]">
                              {dog.name}
                            </p>
                            <span
                              className="h-4 w-px shrink-0 bg-[var(--app-border)]"
                              aria-hidden="true"
                            />
                            <span className="inline-flex shrink-0 items-center gap-1.5">
                              {dog.sex === 'female' ? (
                                <Venus
                                  className="shrink-0 text-pink-500"
                                  size={15}
                                  aria-hidden="true"
                                />
                              ) : (
                                <Mars
                                  className="shrink-0 text-sky-500"
                                  size={15}
                                  aria-hidden="true"
                                />
                              )}
                              {dog.sex === 'female' ? t('dogs.sexFemale') : t('dogs.sexMale')}
                            </span>
                            {ageLabel ? (
                              <>
                                <span
                                  className="h-4 w-px shrink-0 bg-[var(--app-border)]"
                                  aria-hidden="true"
                                />
                                <span className="shrink-0">{ageLabel}</span>
                              </>
                            ) : null}
                          </div>
                        </>
                      );
                    })()}
                    {dog.breed ? (
                      <p className="mt-1 text-sm text-[var(--app-muted)]">{dog.breed}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      aria-label={t('dogs.edit')}
                      className="icon-button text-[var(--app-link)]"
                      type="button"
                      onClick={() => {
                        setIsCreateFormOpen(false);
                        setEditingDogId(dog.id);
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      aria-label={t('dogs.delete')}
                      className="icon-button text-red-500"
                      disabled={deleteDogMutation.isPending}
                      type="button"
                      onClick={() => deleteDogMutation.mutate(dog.id)}
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

function formatDogAge(birthDate: string | null, locale: 'ru' | 'en'): string | null {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();
  let ageInYears = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    ageInYears -= 1;
  }

  if (ageInYears < 1) {
    return locale === 'ru' ? 'до года' : 'under 1 year';
  }

  if (locale === 'en') {
    return ageInYears === 1 ? '1 year' : `${ageInYears} years`;
  }

  const lastDigit = ageInYears % 10;
  const lastTwoDigits = ageInYears % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${ageInYears} год`;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${ageInYears} года`;
  }

  return `${ageInYears} лет`;
}
