import { useState, type FormEvent } from 'react';

import { useCreateDogMutation } from '../useCreateDogMutation.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../../presentation/components/InfoCard.js';

interface CreateDogFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

export function CreateDogForm({ onCancel, onCreated }: CreateDogFormProps) {
  const { t } = useI18n();
  const createDogMutation = useCreateDogMutation();
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'female' | 'male'>('female');
  const [birthDate, setBirthDate] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await createDogMutation.mutateAsync({
        name: name.trim(),
        sex,
        birthDate: birthDate || null,
      });

      setName('');
      setSex('female');
      setBirthDate('');
      onCreated();
    } catch {
      // Error state is handled by createDogMutation.error.
    }
  }

  return (
    <InfoCard>
      <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block text-sm font-medium" htmlFor="dog-name">
          {t('dogs.name')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--app-link)]"
          id="dog-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label className="block text-sm font-medium" htmlFor="dog-sex">
          {t('dogs.sex')}
        </label>
        <select
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--app-link)]"
          id="dog-sex"
          value={sex}
          onChange={(event) => setSex(event.target.value as 'female' | 'male')}
        >
          <option value="female">{t('dogs.sexFemale')}</option>
          <option value="male">{t('dogs.sexMale')}</option>
        </select>

        <label className="block text-sm font-medium" htmlFor="dog-birth-date">
          {t('dogs.birthDate')}
        </label>
        <input
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--app-link)]"
          id="dog-birth-date"
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
        />

        {createDogMutation.error ? (
          <p className="text-sm text-red-500">{t('dogs.createError')}</p>
        ) : null}

        <div className="flex gap-2">
          <button
            className="primary-button flex-1 justify-center"
            type="submit"
            disabled={createDogMutation.isPending}
          >
            {createDogMutation.isPending ? t('dogs.creating') : t('common.add')}
          </button>
          <button
            className="icon-button min-w-24 px-3 text-sm font-semibold"
            type="button"
            disabled={createDogMutation.isPending}
            onClick={onCancel}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
