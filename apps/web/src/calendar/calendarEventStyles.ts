import type { HealthEventType } from '../api/types.js';
import type { CalendarEventKind } from './calendarEventTypes.js';

interface CalendarEventStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

const healthEventTypeStyles: Record<HealthEventType, CalendarEventStyle> = {
  vaccination: {
    backgroundColor: '#e0f2fe',
    borderColor: '#38bdf8',
    textColor: '#075985',
  },
  revaccination: {
    backgroundColor: '#e0f2fe',
    borderColor: '#38bdf8',
    textColor: '#075985',
  },
  deworming: {
    backgroundColor: '#d1fae5',
    borderColor: '#34d399',
    textColor: '#065f46',
  },
  tick_treatment: {
    backgroundColor: '#ecfccb',
    borderColor: '#84cc16',
    textColor: '#3f6212',
  },
  flea_treatment: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    textColor: '#92400e',
  },
  weight_tracking: {
    backgroundColor: '#ede9fe',
    borderColor: '#8b5cf6',
    textColor: '#5b21b6',
  },
  vet_visit: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    textColor: '#1d4ed8',
  },
  surgery: {
    backgroundColor: '#ffe4e6',
    borderColor: '#fb7185',
    textColor: '#9f1239',
  },
  other: {
    backgroundColor: '#f1f5f9',
    borderColor: '#94a3b8',
    textColor: '#334155',
  },
};

const calendarEventStyles: Record<CalendarEventKind, CalendarEventStyle> = {
  heatCycle: {
    backgroundColor: '#fce7f3',
    borderColor: '#f9a8d4',
    textColor: '#9d174d',
  },
  predictedHeatCycle: {
    backgroundColor: '#f3e8ff',
    borderColor: '#c084fc',
    textColor: '#6b21a8',
  },
  healthEvent: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    textColor: '#1d4ed8',
  },
  reminder: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    textColor: '#92400e',
  },
};

export function getCalendarEventStyle(
  kind: CalendarEventKind,
  healthEventType?: HealthEventType,
): CalendarEventStyle {
  if (healthEventType && kind === 'healthEvent') {
    return healthEventTypeStyles[healthEventType];
  }

  return calendarEventStyles[kind];
}
