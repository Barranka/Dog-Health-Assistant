import { useQuery } from '@tanstack/react-query';

import { listHealthEvents } from '../api/healthEventsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useHealthEventsQuery(dogId: string | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['healthEvents', dogId],
    queryFn: () => {
      if (!token || !dogId) {
        return [];
      }

      return listHealthEvents(token, dogId);
    },
    enabled: Boolean(token && dogId),
  });
}
