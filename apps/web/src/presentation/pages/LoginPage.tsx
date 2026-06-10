import { ShieldCheck } from 'lucide-react';

import { TelegramLoginButton } from '../../auth/components/TelegramLoginButton.js';
import { useAuth } from '../../auth/useAuth.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

interface LoginPageProps {
  isLoading: boolean;
  isTelegram: boolean;
}

export function LoginPage({ isLoading, isTelegram }: LoginPageProps) {
  const { error, loginWithDevUser } = useAuth();
  const { t } = useI18n();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--app-bg)] px-4 py-8 text-[var(--app-text)]">
      <div className="w-full max-w-[420px] space-y-4">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--app-button)] text-[var(--app-button-text)]">
            <ShieldCheck size={26} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--app-muted)]">
            {t('app.name')}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">{t('auth.loginTitle')}</h1>
          <p className="mt-2 text-sm leading-5 text-[var(--app-muted)]">
            {isTelegram ? t('auth.telegramLoginLoading') : t('auth.webLoginHint')}
          </p>
        </div>

        <InfoCard>
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-[var(--app-muted)]">{t('auth.loginLoading')}</p>
            ) : null}

            {!isTelegram ? <TelegramLoginButton /> : null}

            {import.meta.env.DEV ? (
              <button
                className="primary-button w-full justify-center"
                type="button"
                disabled={isLoading}
                onClick={() => void loginWithDevUser()}
              >
                {t('auth.devLogin')}
              </button>
            ) : null}

            {error ? <p className="text-sm text-red-500">{t('auth.loginError')}</p> : null}
          </div>
        </InfoCard>
      </div>
    </main>
  );
}
