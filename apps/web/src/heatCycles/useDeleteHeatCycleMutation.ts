import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteHeatCycle } from '../api/heatCyclesApi.js';
import { useAuth } from '../auth/useAuth.js';

interface DeleteHeatCycleVariables {
  dogId: string;
  heatCycleId: string;
}

export function useDeleteHeatCycleMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, heatCycleId }: DeleteHeatCycleVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return deleteHeatCycle(token, dogId, heatCycleId);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['heatCycles', variables.dogId],
      });
    },
  });
}
