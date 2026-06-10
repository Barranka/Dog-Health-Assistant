import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateHeatCycle } from '../api/heatCyclesApi.js';
import type { UpdateHeatCyclePayload } from '../api/types.js';
import { useAuth } from '../auth/useAuth.js';

interface UpdateHeatCycleVariables {
  dogId: string;
  heatCycleId: string;
  payload: UpdateHeatCyclePayload;
}

export function useUpdateHeatCycleMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, heatCycleId, payload }: UpdateHeatCycleVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return updateHeatCycle(token, dogId, heatCycleId, payload);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['heatCycles', variables.dogId],
      });
    },
  });
}
