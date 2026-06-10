import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateHealthEvent } from '../api/healthEventsApi.js';
import type { UpdateHealthEventPayload } from '../api/types.js';
import { useAuth } from '../auth/useAuth.js';

interface UpdateHealthEventVariables {
  dogId: string;
  healthEventId: string;
  payload: UpdateHealthEventPayload;
}

export function useUpdateHealthEventMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, healthEventId, payload }: UpdateHealthEventVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return updateHealthEvent(token, dogId, healthEventId, payload);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['healthEvents', variables.dogId],
      });
    },
  });
}
