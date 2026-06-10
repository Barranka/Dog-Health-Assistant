import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createDog } from '../api/dogsApi.js';
import type { CreateDogPayload } from '../api/types.js';
import { useAuth } from '../auth/useAuth.js';

export function useCreateDogMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDogPayload) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return createDog(token, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dogs'] });
    },
  });
}
