import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createHeatCycle } from '../api/heatCyclesApi.js';
import type { CreateHeatCyclePayload } from '../api/types.js';
import { useAuth } from '../auth/useAuth.js';

interface CreateHeatCycleVariables {
  dogId: string;
  payload: CreateHeatCyclePayload;
}

export function useCreateHeatCycleMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, payload }: CreateHeatCycleVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return createHeatCycle(token, dogId, payload);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['heatCycles', variables.dogId],
      });
    },
  });
}
