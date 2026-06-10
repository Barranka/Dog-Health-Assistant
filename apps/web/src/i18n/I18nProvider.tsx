import { createContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { useTelegram } from '../telegram/useTelegram.js';
import { detectLocale } from './detectLocale.js';
import type { Locale, TranslationKey } from './dictionaries.js';
import { translate } from './translate.js';

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const { user } = useTelegram();
  const [locale, setLocale] = useState<Locale>(() => detectLocale(user?.languageCode));

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translate(locale, key),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
