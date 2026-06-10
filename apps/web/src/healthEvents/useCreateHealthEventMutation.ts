import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createHealthEvent } from '../api/healthEventsApi.js';
import type { CreateHealthEventPayload } from '../api/types.js';
import { useAuth } from '../auth/useAuth.js';

interface CreateHealthEventVariables {
  dogId: string;
  payload: CreateHealthEventPayload;
}

export function useCreateHealthEventMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, payload }: CreateHealthEventVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return createHealthEvent(token, dogId, payload);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['healthEvents', variables.dogId],
      });
    },
  });
}
