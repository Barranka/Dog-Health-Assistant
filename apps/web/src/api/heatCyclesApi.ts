import { apiRequest } from './apiClient.js';
import type { CreateHeatCyclePayload, HeatCycleRecord, UpdateHeatCyclePayload } from './types.js';

export function listHeatCycles(token: string, dogId: string): Promise<HeatCycleRecord[]> {
  return apiRequest<HeatCycleRecord[]>(`/dogs/${dogId}/heat-cycles`, {
    token,
  });
}

export function createHeatCycle(
  token: string,
  dogId: string,
  payload: CreateHeatCyclePayload,
): Promise<HeatCycleRecord> {
  return apiRequest<HeatCycleRecord>(`/dogs/${dogId}/heat-cycles`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateHeatCycle(
  token: string,
  dogId: string,
  heatCycleId: string,
  payload: UpdateHeatCyclePayload,
): Promise<HeatCycleRecord> {
  return apiRequest<HeatCycleRecord>(`/dogs/${dogId}/heat-cycles/${heatCycleId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteHeatCycle(token: string, dogId: string, heatCycleId: string): Promise<void> {
  return apiRequest<void>(`/dogs/${dogId}/heat-cycles/${heatCycleId}`, {
    method: 'DELETE',
    token,
  });
}
