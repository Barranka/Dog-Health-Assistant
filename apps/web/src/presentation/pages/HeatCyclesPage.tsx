import { CalendarPlus } from 'lucide-react';

import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function HeatCyclesPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('heatCycles.title')}</h2>
      <InfoCard>
        <CalendarPlus className="text-[var(--app-link)]" size={24} />
        <p className="mt-3 font-semibold">{t('heatCycles.emptyTitle')}</p>
        <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
          {t('heatCycles.emptyDescription')}
        </p>
      </InfoCard>
    </div>
  );
}
