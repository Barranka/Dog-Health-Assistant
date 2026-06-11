import { apiRequest } from './apiClient.js';
import type { NotificationRecord, UnreadNotificationsCount } from './types.js';

export function listNotifications(token: string): Promise<NotificationRecord[]> {
  return apiRequest<NotificationRecord[]>('/notifications', {
    token,
  });
}

export function getUnreadNotificationsCount(token: string): Promise<UnreadNotificationsCount> {
  return apiRequest<UnreadNotificationsCount>('/notifications/unread-count', {
    token,
  });
}

export function markNotificationRead(
  token: string,
  notificationId: string,
): Promise<NotificationRecord> {
  return apiRequest<NotificationRecord>(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
    token,
  });
}

export function markAllNotificationsRead(token: string): Promise<{ updatedCount: number }> {
  return apiRequest<{ updatedCount: number }>('/notifications/read-all', {
    method: 'PATCH',
    token,
  });
}
