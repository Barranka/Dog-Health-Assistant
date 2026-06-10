import { InfoCard } from '../components/InfoCard.js';
import { useTelegram } from '../../telegram/useTelegram.js';
import { useI18n } from '../../i18n/useI18n.js';

export function SettingsPage() {
  const { colorScheme, initData, isTelegram } = useTelegram();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('app.settings')}</h2>
      <InfoCard>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--app-muted)]">{t('app.mode')}</dt>
            <dd className="font-medium">
              {isTelegram ? 'Telegram Mini App' : t('app.browserPreview')}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--app-muted)]">{t('app.theme')}</dt>
            <dd className="font-medium">{colorScheme}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--app-muted)]">{t('app.language')}</dt>
            <dd className="flex rounded-lg border border-[var(--app-border)] p-1">
              <button
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  locale === 'ru' ? 'bg-[var(--app-button)] text-[var(--app-button-text)]' : ''
                }`}
                type="button"
                onClick={() => setLocale('ru')}
              >
                RU
              </button>
              <button
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  locale === 'en' ? 'bg-[var(--app-button)] text-[var(--app-button-text)]' : ''
                }`}
                type="button"
                onClick={() => setLocale('en')}
              >
                EN
              </button>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--app-muted)]">initData</dt>
            <dd className="font-medium">{initData ? t('app.received') : t('app.notReceived')}</dd>
          </div>
        </dl>
      </InfoCard>
    </div>
  );
}
