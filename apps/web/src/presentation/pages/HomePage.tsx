import { CalendarPlus, CircleAlert, HeartPulse, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { TranslationKey } from '../../i18n/dictionaries.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';
import { SectionHeader } from '../components/SectionHeader.js';

const quickActions = [
  {
    to: '/dogs',
    labelKey: 'common.addDog',
    icon: PawPrint,
  },
  {
    to: '/heat-cycles',
    labelKey: 'home.heatCycle',
    icon: CalendarPlus,
  },
  {
    to: '/health',
    labelKey: 'home.healthEvent',
    icon: HeartPulse,
  },
  {
    to: '/symptoms',
    labelKey: 'home.symptoms',
    icon: CircleAlert,
  },
] as const satisfies ReadonlyArray<{
  to: string;
  labelKey: TranslationKey;
  icon: typeof PawPrint;
}>;

export function HomePage() {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <InfoCard className="bg-[var(--app-accent-soft)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--app-muted)]">{t('home.activeDog')}</p>
            <h2 className="mt-1 text-2xl font-semibold">{t('home.noActiveDog')}</h2>
            <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
              {t('home.addPetDescription')}
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--app-button)] text-[var(--app-button-text)]">
            <PawPrint size={26} />
          </div>
        </div>
      </InfoCard>

      <section>
        <SectionHeader title={t('home.quickActions')} />
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                className="flex min-h-24 flex-col justify-between rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-4 transition hover:bg-[var(--app-surface)]"
                key={action.to}
                to={action.to}
              >
                <Icon size={22} className="text-[var(--app-link)]" />
                <span className="text-sm font-semibold">{t(action.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title={t('home.nextEvent')} action={t('common.calendar')} />
        <InfoCard>
          <p className="text-sm font-semibold">{t('home.noScheduledEvents')}</p>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {t('home.scheduledEventsDescription')}
          </p>
        </InfoCard>
      </section>
    </div>
  );
}
