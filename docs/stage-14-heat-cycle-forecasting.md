# Stage 14: Heat Cycle Forecasting

## Goal

Add a reusable heat-cycle forecasting layer that predicts the next expected heat based on the dog's recorded history.

## Implemented

- Added computed heat-cycle forecast logic in `apps/web/src/heatCycles/heatCycleForecast.ts`.
- Used the average interval between recorded heat starts when enough history exists.
- Used a fallback interval of 180 days when there is not enough history.
- Reused the same forecast in reproductive-cycle analytics.
- Added the computed next heat forecast to the calendar as a predicted heat event.

## Notes

- The forecast is not stored in the database.
- Active heat cycles do not produce a next-heat forecast until an end date is recorded.
- Existing predicted records are ignored when calculating the average interval.
