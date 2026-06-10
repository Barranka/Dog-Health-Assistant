import { useContext } from 'react';

import { TelegramContext } from './TelegramProvider.js';

export function useTelegram() {
  const value = useContext(TelegramContext);

  if (!value) {
    throw new Error('useTelegram must be used inside TelegramProvider.');
  }

  return value;
}
