const millisecondsPerDay = 24 * 60 * 60 * 1000;

export interface DayRange {
  start: Date;
  end: Date;
}

export function getUtcDayRange(date: Date): DayRange {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const end = addDays(start, 1);

  return {
    start,
    end,
  };
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

export function getInclusiveDayDifference(startDate: Date, endDate: Date): number {
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  );
  const end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

  return Math.max(1, Math.floor((end - start) / millisecondsPerDay) + 1);
}

export function getElapsedDayDifference(startDate: Date, endDate: Date): number {
  const start = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  );
  const end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

  return Math.max(0, Math.floor((end - start) / millisecondsPerDay));
}
