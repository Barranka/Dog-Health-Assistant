const DEFAULT_API_PORT = 3000;

export interface ApiEnvironment {
  NODE_ENV: 'development' | 'test' | 'production';
  API_PORT: number;
}

export function getApiPort(): number {
  const rawPort = process.env.API_PORT;

  if (!rawPort) {
    return DEFAULT_API_PORT;
  }

  const parsedPort = Number.parseInt(rawPort, 10);

  return Number.isNaN(parsedPort) ? DEFAULT_API_PORT : parsedPort;
}
