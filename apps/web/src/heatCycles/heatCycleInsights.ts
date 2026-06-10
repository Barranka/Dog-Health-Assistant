import type { HeatCycleRecord } from '../api/types.js';
import type { TranslationKey } from '../i18n/dictionaries.js';

interface ForecastRange {
  from: Date;
  to: Date;
  isPersonalized: boolean;
}

export type ReproductivePhase = 'proestrus' | 'estrus' | 'diestrus' | 'anestrus';

export interface ActiveHeatCycleInsights {
  cycleDay: number;
  forecastRange: ForecastRange;
  phaseKey: TranslationKey;
  phaseHintKey: TranslationKey;
  shouldAskIfCompleted: boolean;
}

export interface CycleAnalytics {
  cycleDay: number;
  phase: ReproductivePhase;
  phaseLabelKey: TranslationKey;
  phaseMedicalNameKey: TranslationKey;
  phaseDescriptionKey: TranslationKey;
  statusKey: TranslationKey;
  lastHeatStartDate: Date;
  lastHeatEndDate: Date | null;
  daysAfterHeatEnd: number | null;
  nextHeatEstimatedAt: Date | null;
  averageCycleLengthDays: number | null;
  averageHeatLengthDays: number | null;
  activeEndForecastRange: ForecastRange | null;
  shouldAskIfCompleted: boolean;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const defaultCycleLengthDays = 183;

export function getActiveHeatCycleInsights(
  cycle: HeatCycleRecord,
  heatCycles: HeatCycleRecord[],
  now = new Date(),
): ActiveHeatCycleInsights {
  const startDate = parseDateOnly(cycle.startDate);
  const cycleDay = getInclusiveDayDifference(startDate, now);
  const averageDuration = getAverageCompletedDuration(heatCycles);
  const forecastRange = averageDuration
    ? getPersonalizedForecastRange(startDate, averageDuration)
    : getDefaultForecastRange(startDate);

  return {
    cycleDay,
    forecastRange,
    ...getPhase(cycleDay),
    shouldAskIfCompleted: cycleDay > 21,
  };
}

export function getCycleAnalytics(
  heatCycles: HeatCycleRecord[],
  now = new Date(),
): CycleAnalytics | null {
  const sortedCycles = [...heatCycles].sort(
    (firstCycle, secondCycle) =>
      parseDateOnly(firstCycle.startDate).getTime() -
      parseDateOnly(secondCycle.startDate).getTime(),
  );
  const lastCycle = sortedCycles.at(-1);

  if (!lastCycle) {
    return null;
  }

  const startDate = parseDateOnly(lastCycle.startDate);
  const endDate = lastCycle.endDate ? parseDateOnly(lastCycle.endDate) : null;
  const cycleDay = getInclusiveDayDifference(startDate, now);
  const averageHeatLengthDays = getAverageCompletedDuration(sortedCycles);
  const averageCycleLengthDays = getAverageCycleLength(sortedCycles);
  const activeEndForecastRange = endDate
    ? null
    : averageHeatLengthDays
      ? getPersonalizedForecastRange(startDate, averageHeatLengthDays)
      : getDefaultForecastRange(startDate);
  const nextHeatEstimatedAt = endDate
    ? addDays(startDate, averageCycleLengthDays ?? defaultCycleLengthDays)
    : null;
  const daysAfterHeatEnd = endDate ? getElapsedDayDifference(endDate, now) : null;
  const phase = getReproductivePhase(cycleDay, daysAfterHeatEnd);

  return {
    cycleDay,
    phase,
    ...getPhaseCopy(phase),
    statusKey: endDate ? 'heatCycles.afterHeatStatus' : 'heatCycles.activeStatus',
    lastHeatStartDate: startDate,
    lastHeatEndDate: endDate,
    daysAfterHeatEnd,
    nextHeatEstimatedAt,
    averageCycleLengthDays,
    averageHeatLengthDays,
    activeEndForecastRange,
    shouldAskIfCompleted: !endDate && cycleDay > 21,
  };
}

export function formatDayMonth(date: Date): string {
  return `${padDatePart(date.getUTCDate())}.${padDatePart(date.getUTCMonth() + 1)}`;
}

export function formatDate(date: Date): string {
  return `${formatDayMonth(date)}.${date.getUTCFullYear()}`;
}

export function formatFullDate(value: string): string {
  const date = parseDateOnly(value);

  return formatDate(date);
}

function getAverageCompletedDuration(heatCycles: HeatCycleRecord[]): number | null {
  const durations = heatCycles
    .filter((cycle) => cycle.status === 'completed')
    .map((cycle) => cycle.duration ?? getDurationFromDates(cycle))
    .filter((duration): duration is number => Boolean(duration));

  if (durations.length === 0) {
    return null;
  }

  const total = durations.reduce((sum, duration) => sum + duration, 0);

  return Math.round(total / durations.length);
}

function getDurationFromDates(cycle: HeatCycleRecord): number | null {
  if (!cycle.endDate) {
    return null;
  }

  return getInclusiveDayDifference(parseDateOnly(cycle.startDate), parseDateOnly(cycle.endDate));
}

function getAverageCycleLength(heatCycles: HeatCycleRecord[]): number | null {
  if (heatCycles.length < 2) {
    return null;
  }

  const intervals: number[] = [];

  for (let index = 1; index < heatCycles.length; index += 1) {
    const previousCycle = heatCycles[index - 1];
    const cycle = heatCycles[index];

    if (previousCycle && cycle) {
      intervals.push(
        getElapsedDayDifference(
          parseDateOnly(previousCycle.startDate),
          parseDateOnly(cycle.startDate),
        ),
      );
    }
  }
  const total = intervals.reduce((sum, interval) => sum + interval, 0);

  return Math.round(total / intervals.length);
}

function getDefaultForecastRange(startDate: Date): ForecastRange {
  return {
    from: addDays(startDate, 14),
    to: addDays(startDate, 28),
    isPersonalized: false,
  };
}

function getPersonalizedForecastRange(startDate: Date, averageDuration: number): ForecastRange {
  return {
    from: addDays(startDate, Math.max(1, averageDuration - 2)),
    to: addDays(startDate, averageDuration + 2),
    isPersonalized: true,
  };
}

function getReproductivePhase(
  cycleDay: number,
  daysAfterHeatEnd: number | null,
): ReproductivePhase {
  if (daysAfterHeatEnd !== null) {
    return daysAfterHeatEnd <= 60 ? 'diestrus' : 'anestrus';
  }

  return cycleDay <= 7 ? 'proestrus' : 'estrus';
}

function getPhaseCopy(
  phase: ReproductivePhase,
): Pick<CycleAnalytics, 'phaseLabelKey' | 'phaseMedicalNameKey' | 'phaseDescriptionKey'> {
  const copyByPhase: Record<
    ReproductivePhase,
    Pick<CycleAnalytics, 'phaseLabelKey' | 'phaseMedicalNameKey' | 'phaseDescriptionKey'>
  > = {
    proestrus: {
      phaseLabelKey: 'heatCycles.phaseInitial',
      phaseMedicalNameKey: 'heatCycles.medicalPhaseProestrus',
      phaseDescriptionKey: 'heatCycles.phaseInitialHint',
    },
    estrus: {
      phaseLabelKey: 'heatCycles.phaseFertile',
      phaseMedicalNameKey: 'heatCycles.medicalPhaseEstrus',
      phaseDescriptionKey: 'heatCycles.phaseFertileHint',
    },
    diestrus: {
      phaseLabelKey: 'heatCycles.phaseAfterHeat',
      phaseMedicalNameKey: 'heatCycles.medicalPhaseDiestrus',
      phaseDescriptionKey: 'heatCycles.phaseAfterHeatHint',
    },
    anestrus: {
      phaseLabelKey: 'heatCycles.phaseWaiting',
      phaseMedicalNameKey: 'heatCycles.medicalPhaseAnestrus',
      phaseDescriptionKey: 'heatCycles.phaseWaitingHint',
    },
  };

  return copyByPhase[phase];
}

function getPhase(cycleDay: number): Pick<ActiveHeatCycleInsights, 'phaseKey' | 'phaseHintKey'> {
  if (cycleDay <= 7) {
    return {
      phaseKey: 'heatCycles.phaseInitial',
      phaseHintKey: 'heatCycles.phaseInitialHint',
    };
  }

  if (cycleDay <= 16) {
    return {
      phaseKey: 'heatCycles.phaseFertile',
      phaseHintKey: 'heatCycles.phaseFertileHint',
    };
  }

  return {
    phaseKey: 'heatCycles.phaseLate',
    phaseHintKey: 'heatCycles.phaseLateHint',
  };
}

function getInclusiveDayDifference(startDate: Date, endDate: Date): number {
  const start = getUtcDateOnlyTime(startDate);
  const end = getUtcDateOnlyTime(endDate);
  const difference = Math.floor((end - start) / millisecondsPerDay) + 1;

  return Math.max(1, difference);
}

function getElapsedDayDifference(startDate: Date, endDate: Date): number {
  const start = getUtcDateOnlyTime(startDate);
  const end = getUtcDateOnlyTime(endDate);

  return Math.max(0, Math.floor((end - start) / millisecondsPerDay));
}

function parseDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function getUtcDateOnlyTime(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function padDatePart(value: number): string {
  return value.toString().padStart(2, '0');
}
