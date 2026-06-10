import type { PropsWithChildren } from 'react';

import { LoginPage } from '../presentation/pages/LoginPage.js';
import { useTelegram } from '../telegram/useTelegram.js';
import { useAuth } from './useAuth.js';

export function AuthGate({ children }: PropsWithChildren) {
  const { isTelegram } = useTelegram();
  const { isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return <LoginPage isLoading={isLoading} isTelegram={isTelegram} />;
}
