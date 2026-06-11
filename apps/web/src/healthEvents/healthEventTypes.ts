import type { HealthEventType } from '../api/types.js';
import type { TranslationKey } from '../i18n/dictionaries.js';

export const healthEventTypes = [
  'vaccination',
  'deworming',
  'tick_treatment',
  'flea_treatment',
  'weight_tracking',
  'vet_visit',
  'surgery',
  'other',
] as const satisfies readonly HealthEventType[];

export function getHealthEventTypeLabelKey(type: HealthEventType): TranslationKey {
  const labelKeys: Record<HealthEventType, TranslationKey> = {
    vaccination: 'healthPage.typeVaccination',
    revaccination: 'healthPage.typeVaccination',
    deworming: 'healthPage.typeDeworming',
    tick_treatment: 'healthPage.typeTickTreatment',
    flea_treatment: 'healthPage.typeFleaTreatment',
    weight_tracking: 'healthPage.typeWeightTracking',
    vet_visit: 'healthPage.typeVetVisit',
    surgery: 'healthPage.typeSurgery',
    other: 'healthPage.typeOther',
  };

  return labelKeys[type];
}

export function getHealthEventTypeShortLabelKey(type: HealthEventType): TranslationKey {
  const labelKeys: Record<HealthEventType, TranslationKey> = {
    vaccination: 'calendar.shortVaccination',
    revaccination: 'calendar.shortVaccination',
    deworming: 'calendar.shortDeworming',
    tick_treatment: 'calendar.shortTickTreatment',
    flea_treatment: 'calendar.shortFleaTreatment',
    weight_tracking: 'calendar.shortWeightTracking',
    vet_visit: 'calendar.shortVetVisit',
    surgery: 'calendar.shortSurgery',
    other: 'calendar.shortOther',
  };

  return labelKeys[type];
}

export function getHealthEventTypeBadgeClassName(type: HealthEventType): string {
  const badgeClassNames: Record<HealthEventType, string> = {
    vaccination: 'bg-sky-50 text-sky-700 ring-sky-200',
    revaccination: 'bg-sky-50 text-sky-700 ring-sky-200',
    deworming: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    tick_treatment: 'bg-lime-50 text-lime-700 ring-lime-200',
    flea_treatment: 'bg-amber-50 text-amber-700 ring-amber-200',
    weight_tracking: 'bg-violet-50 text-violet-700 ring-violet-200',
    vet_visit: 'bg-blue-50 text-blue-700 ring-blue-200',
    surgery: 'bg-rose-50 text-rose-700 ring-rose-200',
    other: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  return badgeClassNames[type];
}
