import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteHealthEvent } from '../api/healthEventsApi.js';
import { useAuth } from '../auth/useAuth.js';

interface DeleteHealthEventVariables {
  dogId: string;
  healthEventId: string;
}

export function useDeleteHealthEventMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, healthEventId }: DeleteHealthEventVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return deleteHealthEvent(token, dogId, healthEventId);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['healthEvents', variables.dogId],
      });
    },
  });
}
