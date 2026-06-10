export function calculateHeatCycleDuration(startDate: Date, endDate: Date | null): number | null {
  if (!endDate) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;

  return duration > 0 ? duration : null;
}
