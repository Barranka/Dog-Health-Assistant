import { HeartPulse, Plus } from 'lucide-react';

import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function HealthPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('healthPage.title')}</h2>
        <button className="primary-button" type="button">
          <Plus size={18} />
          <span>{t('healthPage.addRecord')}</span>
        </button>
      </div>
      <InfoCard>
        <HeartPulse className="text-[var(--app-link)]" size={24} />
        <p className="mt-3 font-semibold">{t('healthPage.emptyTitle')}</p>
        <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
          {t('healthPage.emptyDescription')}
        </p>
      </InfoCard>
    </div>
  );
}
