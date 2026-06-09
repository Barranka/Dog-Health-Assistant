import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

export function loadBotEnvironment(): void {
  const candidatePaths = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../../.env'),
  ];

  const envPath = candidatePaths.find((candidatePath) => existsSync(candidatePath));

  if (envPath) {
    loadEnvFile(envPath);
  }
}
