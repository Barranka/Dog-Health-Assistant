import type { Locale } from './dictionaries.js';

export function detectLocale(languageCode?: string | null): Locale {
  const sourceLanguage = languageCode ?? navigator.language;

  return sourceLanguage.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
