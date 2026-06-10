import { apiRequest } from './apiClient.js';
import type { CreateDogPayload, DogProfile, UpdateDogPayload } from './types.js';

export function listDogs(token: string): Promise<DogProfile[]> {
  return apiRequest<DogProfile[]>('/dogs', {
    token,
  });
}

export function createDog(token: string, payload: CreateDogPayload): Promise<DogProfile> {
  return apiRequest<DogProfile>('/dogs', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateDog(
  token: string,
  dogId: string,
  payload: UpdateDogPayload,
): Promise<DogProfile> {
  return apiRequest<DogProfile>(`/dogs/${dogId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteDog(token: string, dogId: string): Promise<void> {
  return apiRequest<void>(`/dogs/${dogId}`, {
    method: 'DELETE',
    token,
  });
}
