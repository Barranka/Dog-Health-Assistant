export type HealthEventType =
  | 'vaccination'
  | 'revaccination'
  | 'deworming'
  | 'tick_treatment'
  | 'flea_treatment'
  | 'weight_tracking'
  | 'vet_visit'
  | 'surgery'
  | 'other';

export const healthEventTypes = [
  'vaccination',
  'revaccination',
  'deworming',
  'tick_treatment',
  'flea_treatment',
  'weight_tracking',
  'vet_visit',
  'surgery',
  'other',
] as const satisfies readonly HealthEventType[];

export const editableHealthEventTypes = [
  'vaccination',
  'deworming',
  'tick_treatment',
  'flea_treatment',
  'weight_tracking',
  'vet_visit',
  'surgery',
  'other',
] as const satisfies readonly HealthEventType[];
