import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markAllNotificationsRead } from '../api/notificationsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useMarkAllNotificationsReadMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error('Auth token is required.');
      }

      return markAllNotificationsRead(token);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
