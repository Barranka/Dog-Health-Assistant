import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { defineConfig, env } from 'prisma/config';

loadEnvFile(fileURLToPath(new URL('../../.env', import.meta.url)));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
