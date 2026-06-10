import { useQuery } from '@tanstack/react-query';

import { listHeatCycles } from '../api/heatCyclesApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useHeatCyclesQuery(dogId: string | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['heatCycles', dogId],
    queryFn: () => {
      if (!token || !dogId) {
        return [];
      }

      return listHeatCycles(token, dogId);
    },
    enabled: Boolean(token && dogId),
  });
}
