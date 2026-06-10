import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import {
  loginWithDevUser as loginWithDevUserApi,
  loginWithTelegramMiniApp,
  loginWithTelegramWidget as loginWithTelegramWidgetApi,
} from '../api/authApi.js';
import type { TelegramLoginPayload, UserProfile } from '../api/types.js';
import { useTelegram } from '../telegram/useTelegram.js';

export interface AuthContextValue {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithTelegramWidget: (payload: TelegramLoginPayload) => Promise<void>;
  loginWithDevUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { initData, isTelegram } = useTelegram();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isTelegram || !initData || token) {
      return;
    }

    let isMounted = true;

    async function login() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loginWithTelegramMiniApp(initData);

        if (!isMounted) {
          return;
        }

        setToken(result.token.accessToken);
        setUser(result.user);
      } catch {
        if (!isMounted) {
          return;
        }

        setError('Failed to authorize with Telegram.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void login();

    return () => {
      isMounted = false;
    };
  }, [initData, isTelegram, token]);

  const loginWithTelegramWidget = useCallback(
    async (payload: TelegramLoginPayload): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loginWithTelegramWidgetApi(payload);

        setToken(result.token.accessToken);
        setUser(result.user);
      } catch {
        setError('Failed to authorize with Telegram.');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loginWithDevUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginWithDevUserApi();

      setToken(result.token.accessToken);
      setUser(result.user);
    } catch {
      setError('Failed to authorize development user.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      error,
      loginWithTelegramWidget,
      loginWithDevUser,
    }),
    [error, isLoading, loginWithDevUser, loginWithTelegramWidget, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
