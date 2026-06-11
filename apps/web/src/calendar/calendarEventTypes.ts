import type { HealthEventType } from '../api/types.js';
import type { TranslationKey } from '../i18n/dictionaries.js';

export type CalendarEventKind = 'heatCycle' | 'predictedHeatCycle' | 'healthEvent' | 'reminder';

export interface CalendarEventItem {
  id: string;
  kind: CalendarEventKind;
  healthEventType?: HealthEventType;
  shortTitleKey?: TranslationKey;
  title: string;
  date: string;
  endDate?: string | null;
  displayEndDate?: string | null;
  description?: string | null;
}
