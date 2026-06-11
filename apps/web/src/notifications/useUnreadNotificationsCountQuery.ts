import { useQuery } from '@tanstack/react-query';

import { getUnreadNotificationsCount } from '../api/notificationsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useUnreadNotificationsCountQuery() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => {
      if (!token) {
        throw new Error('Auth token is required.');
      }

      return getUnreadNotificationsCount(token);
    },
    enabled: Boolean(token),
  });
}
