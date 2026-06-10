import { apiRequest } from './apiClient.js';
import type {
  CreateHealthEventPayload,
  HealthEventRecord,
  UpdateHealthEventPayload,
} from './types.js';

export function listHealthEvents(token: string, dogId: string): Promise<HealthEventRecord[]> {
  return apiRequest<HealthEventRecord[]>(`/dogs/${dogId}/health-events`, {
    token,
  });
}

export function createHealthEvent(
  token: string,
  dogId: string,
  payload: CreateHealthEventPayload,
): Promise<HealthEventRecord> {
  return apiRequest<HealthEventRecord>(`/dogs/${dogId}/health-events`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateHealthEvent(
  token: string,
  dogId: string,
  healthEventId: string,
  payload: UpdateHealthEventPayload,
): Promise<HealthEventRecord> {
  return apiRequest<HealthEventRecord>(`/dogs/${dogId}/health-events/${healthEventId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteHealthEvent(
  token: string,
  dogId: string,
  healthEventId: string,
): Promise<void> {
  return apiRequest<void>(`/dogs/${dogId}/health-events/${healthEventId}`, {
    method: 'DELETE',
    token,
  });
}
