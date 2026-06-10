import { CalendarDays } from 'lucide-react';

import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function CalendarPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('calendar.title')}</h2>
      <InfoCard>
        <CalendarDays className="text-[var(--app-link)]" size={24} />
        <p className="mt-3 font-semibold">{t('calendar.emptyTitle')}</p>
        <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
          {t('calendar.emptyDescription')}
        </p>
      </InfoCard>
    </div>
  );
}
