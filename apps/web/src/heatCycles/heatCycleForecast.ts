import type { HeatCycleRecord } from '../api/types.js';

export interface HeatCycleForecast {
  nextHeatEstimatedAt: Date;
  averageCycleLengthDays: number | null;
  isPersonalized: boolean;
  basedOnCompletedCycles: number;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export const defaultCycleLengthDays = 180;

export function getHeatCycleForecast(heatCycles: HeatCycleRecord[]): HeatCycleForecast | null {
  const realCycles = heatCycles
    .filter((cycle) => !cycle.predicted)
    .sort(
      (firstCycle, secondCycle) =>
        parseDateOnly(firstCycle.startDate).getTime() -
        parseDateOnly(secondCycle.startDate).getTime(),
    );
  const lastCycle = realCycles.at(-1);

  if (!lastCycle || !lastCycle.endDate) {
    return null;
  }

  const averageCycleLengthDays = getAverageCycleLength(realCycles);

  return {
    nextHeatEstimatedAt: addDays(
      parseDateOnly(lastCycle.startDate),
      averageCycleLengthDays ?? defaultCycleLengthDays,
    ),
    averageCycleLengthDays,
    isPersonalized: averageCycleLengthDays !== null,
    basedOnCompletedCycles: realCycles.filter((cycle) => cycle.endDate).length,
  };
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
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

  if (intervals.length === 0) {
    return null;
  }

  const total = intervals.reduce((sum, interval) => sum + interval, 0);

  return Math.round(total / intervals.length);
}

function parseDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function getElapsedDayDifference(startDate: Date, endDate: Date): number {
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  );
  const end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

  return Math.max(0, Math.floor((end - start) / millisecondsPerDay));
}
