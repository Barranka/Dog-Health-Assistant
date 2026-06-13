import { useContext } from 'react';

import { ActiveDogContext } from './ActiveDogProvider.js';

export function useActiveDog() {
  const context = useContext(ActiveDogContext);

  if (!context) {
    throw new Error('useActiveDog must be used within ActiveDogProvider.');
  }

  return context;
}
