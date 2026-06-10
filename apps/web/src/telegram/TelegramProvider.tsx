import { createContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

interface TelegramUser {
  id: string;
  firstName: string | null;
  username: string | null;
  languageCode: string | null;
}

export interface TelegramContextValue {
  initData: string;
  isTelegram: boolean;
  colorScheme: 'light' | 'dark';
  user: TelegramUser | null;
}

export const TelegramContext = createContext<TelegramContextValue | null>(null);

export function TelegramProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<TelegramContextValue>(() => readTelegramSnapshot());

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
      return;
    }

    webApp.ready();
    webApp.expand();
    setSnapshot(readTelegramSnapshot());
  }, []);

  const value = useMemo(() => snapshot, [snapshot]);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

function readTelegramSnapshot(): TelegramContextValue {
  const webApp = window.Telegram?.WebApp;
  const telegramUser = webApp?.initDataUnsafe?.user;

  return {
    initData: webApp?.initData ?? '',
    isTelegram: Boolean(webApp?.initData),
    colorScheme: webApp?.colorScheme ?? 'light',
    user: telegramUser
      ? {
          id: String(telegramUser.id),
          firstName: telegramUser.first_name ?? null,
          username: telegramUser.username ?? null,
          languageCode: telegramUser.language_code ?? null,
        }
      : null,
  };
}
