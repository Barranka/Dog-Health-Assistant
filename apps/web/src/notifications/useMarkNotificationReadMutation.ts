import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markNotificationRead } from '../api/notificationsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useMarkNotificationReadMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!token) {
        throw new Error('Auth token is required.');
      }

      return markNotificationRead(token, notificationId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
