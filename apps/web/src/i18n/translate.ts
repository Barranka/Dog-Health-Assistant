import { dictionaries, type Locale, type TranslationKey } from './dictionaries.js';

export function translate(locale: Locale, key: TranslationKey): string {
  const [section, field] = key.split('.') as [keyof typeof dictionaries.ru, string];
  const sectionDictionary = dictionaries[locale][section];

  return sectionDictionary[field as keyof typeof sectionDictionary];
}
