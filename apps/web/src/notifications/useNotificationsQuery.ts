import { useQuery } from '@tanstack/react-query';

import { listNotifications } from '../api/notificationsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useNotificationsQuery() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => {
      if (!token) {
        throw new Error('Auth token is required.');
      }

      return listNotifications(token);
    },
    enabled: Boolean(token),
  });
}
