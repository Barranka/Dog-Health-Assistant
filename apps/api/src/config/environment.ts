const DEFAULT_API_PORT = 3000;

export interface ApiEnvironment {
  NODE_ENV: 'development' | 'test' | 'production';
  API_PORT: number;
  JWT_SECRET?: string | undefined;
  JWT_EXPIRES_IN: string;
  TELEGRAM_BOT_TOKEN?: string | undefined;
  TELEGRAM_AUTH_MAX_AGE_SECONDS: number;
}

export function getApiPort(): number {
  const rawPort = process.env.API_PORT;

  if (!rawPort) {
    return DEFAULT_API_PORT;
  }

  const parsedPort = Number.parseInt(rawPort, 10);

  return Number.isNaN(parsedPort) ? DEFAULT_API_PORT : parsedPort;
}
