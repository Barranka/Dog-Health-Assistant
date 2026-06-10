import { PawPrint, Plus } from 'lucide-react';

import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function DogsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('dogs.title')}</h2>
        <button className="primary-button" type="button">
          <Plus size={18} />
          <span>{t('common.add')}</span>
        </button>
      </div>
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
    </div>
  );
}
