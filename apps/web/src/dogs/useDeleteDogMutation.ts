import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteDog } from '../api/dogsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useDeleteDogMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dogId: string) => {
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      return deleteDog(token, dogId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dogs'] });
    },
  });
}
