import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDog } from '../api/dogsApi.js';
import type { UpdateDogPayload } from '../api/types.js';
import { useAuth } from '../auth/useAuth.js';

interface UpdateDogVariables {
  dogId: string;
  payload: UpdateDogPayload;
}

export function useUpdateDogMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dogId, payload }: UpdateDogVariables) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return updateDog(token, dogId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dogs'] });
    },
  });
}
