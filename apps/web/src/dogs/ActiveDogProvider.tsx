import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { DogProfile } from '../api/types.js';
import { useDogsQuery } from './useDogsQuery.js';

export interface ActiveDogContextValue {
  activeDog: DogProfile | null;
  activeDogId: string | null;
  areDogsLoading: boolean;
  dogs: DogProfile[];
  setActiveDogId: (dogId: string | null) => void;
}

export const ActiveDogContext = createContext<ActiveDogContextValue | null>(null);

const activeDogStorageKey = 'dog-health-active-dog-id';

interface ActiveDogProviderProps {
  children: ReactNode;
}

export function ActiveDogProvider({ children }: ActiveDogProviderProps) {
  const { data: dogs = [], isLoading: areDogsLoading } = useDogsQuery();
  const [activeDogId, setActiveDogIdState] = useState<string | null>(() => readStoredActiveDogId());

  useEffect(() => {
    if (areDogsLoading) {
      return;
    }

    if (dogs.length === 0) {
      setActiveDogIdState(null);
      window.localStorage.removeItem(activeDogStorageKey);

      return;
    }

    const firstDog = dogs[0];
    const activeDogStillExists = dogs.some((dog) => dog.id === activeDogId);

    if (firstDog && (!activeDogId || !activeDogStillExists)) {
      setActiveDogIdState(firstDog.id);
      window.localStorage.setItem(activeDogStorageKey, firstDog.id);
    }
  }, [activeDogId, areDogsLoading, dogs]);

  const activeDog = dogs.find((dog) => dog.id === activeDogId) ?? null;
  const value = useMemo<ActiveDogContextValue>(
    () => ({
      activeDog,
      activeDogId,
      areDogsLoading,
      dogs,
      setActiveDogId: (dogId) => {
        setActiveDogIdState(dogId);

        if (dogId) {
          window.localStorage.setItem(activeDogStorageKey, dogId);
        } else {
          window.localStorage.removeItem(activeDogStorageKey);
        }
      },
    }),
    [activeDog, activeDogId, areDogsLoading, dogs],
  );

  return <ActiveDogContext.Provider value={value}>{children}</ActiveDogContext.Provider>;
}

function readStoredActiveDogId(): string | null {
  return window.localStorage.getItem(activeDogStorageKey);
}
