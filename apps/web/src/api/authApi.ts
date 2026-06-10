import { apiRequest } from './apiClient.js';
import type { AuthResponse, TelegramLoginPayload, UserProfile } from './types.js';

export function loginWithTelegramMiniApp(initData: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/telegram-mini-app', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  });
}

export function loginWithTelegramWidget(payload: TelegramLoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/telegram-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginWithDevUser(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/dev-login', {
    method: 'POST',
  });
}

export function getCurrentUser(token: string): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', {
    token,
  });
}
