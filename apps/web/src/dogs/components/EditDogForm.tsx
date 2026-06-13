import { useState, type FormEvent } from 'react';

import type { DogProfile } from '../../api/types.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../../presentation/components/InfoCard.js';
import { useUpdateDogMutation } from '../useUpdateDogMutation.js';

interface EditDogFormProps {
  dog: DogProfile;
  onCancel: () => void;
  onUpdated: () => void;
}

export function EditDogForm({ dog, onCancel, onUpdated }: EditDogFormProps) {
  const { t } = useI18n();
  const updateDogMutation = useUpdateDogMutation();
  const [name, setName] = useState(dog.name);
  const [sex, setSex] = useState(dog.sex);
  const [birthDate, setBirthDate] = useState(dog.birthDate ? dog.birthDate.slice(0, 10) : '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await updateDogMutation.mutateAsync({
        dogId: dog.id,
        payload: {
          name: name.trim(),
          sex,
          birthDate: birthDate || null,
        },
      });

      onUpdated();
    } catch {
      // Error state is handled by updateDogMutation.error.
    }
  }

  return (
    <InfoCard>
      <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block text-sm font-medium" htmlFor={`dog-name-${dog.id}`}>
          {t('dogs.name')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`dog-name-${dog.id}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor={`dog-sex-${dog.id}`}>
          {t('dogs.sex')}
        </label>
        <select
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`dog-sex-${dog.id}`}
          value={sex}
          onChange={(event) => setSex(event.target.value as DogProfile['sex'])}
        >
          <option value="female">{t('dogs.sexFemale')}</option>
          <option value="male">{t('dogs.sexMale')}</option>
        </select>

        <label className="block text-sm font-medium" htmlFor={`dog-birth-date-${dog.id}`}>
          {t('dogs.birthDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
          id={`dog-birth-date-${dog.id}`}
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
        />

        {updateDogMutation.error ? (
          <p className="text-sm text-red-500">{t('dogs.updateError')}</p>
        ) : null}

        <div className="flex gap-2">
          <button
            className="primary-button flex-1 justify-center"
            type="submit"
            disabled={updateDogMutation.isPending}
          >
            {updateDogMutation.isPending ? t('dogs.saving') : t('common.save')}
          </button>
          <button
            className="icon-button min-w-24 px-3 text-sm font-semibold"
            type="button"
            disabled={updateDogMutation.isPending}
            onClick={onCancel}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
