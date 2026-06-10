import { useQuery } from '@tanstack/react-query';

import { listDogs } from '../api/dogsApi.js';
import { useAuth } from '../auth/useAuth.js';

export function useDogsQuery() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['dogs'],
    queryFn: () => {
      if (!token) {
        return [];
      }

      return listDogs(token);
    },
    enabled: Boolean(token),
  });
}
