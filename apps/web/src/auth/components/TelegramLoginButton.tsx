import { useEffect, useRef } from 'react';

import { telegramBotUsername } from '../../api/apiConfig.js';
import type { TelegramLoginPayload } from '../../api/types.js';
import { useI18n } from '../../i18n/useI18n.js';
import { useAuth } from '../useAuth.js';

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, loginWithTelegramWidget } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !telegramBotUsername) {
      return;
    }

    window.onTelegramLogin = (user: TelegramLoginPayload) => {
      void loginWithTelegramWidget(user);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', telegramBotUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramLogin(user)');

    container.append(script);

    return () => {
      container.replaceChildren();
      delete window.onTelegramLogin;
    };
  }, [loginWithTelegramWidget]);

  if (!telegramBotUsername) {
    return <p className="text-sm text-[var(--app-muted)]">{t('auth.webLoginUnavailable')}</p>;
  }

  return (
    <div
      aria-busy={isLoading}
      className="flex min-h-10 items-center justify-start"
      ref={containerRef}
    />
  );
}
