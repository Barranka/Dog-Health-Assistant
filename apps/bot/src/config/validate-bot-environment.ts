import type { BotEnvironment } from './bot-environment.js';

const PLACEHOLDER_BOT_TOKEN = 'replace_with_telegram_bot_token';
const DEFAULT_DRY_RUN_APP_URL = 'https://app.project-domain.com';
const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

export function validateBotEnvironment(environment: NodeJS.ProcessEnv): BotEnvironment {
  const botToken = environment.TELEGRAM_BOT_TOKEN;
  const appUrl =
    environment.APP_URL ??
    (environment.BOT_DRY_RUN === 'true' ? DEFAULT_DRY_RUN_APP_URL : undefined);
  const apiBaseUrl = environment.API_BASE_URL ?? DEFAULT_API_BASE_URL;
  const dryRun = environment.BOT_DRY_RUN === 'true';

  if (!botToken || (!dryRun && botToken === PLACEHOLDER_BOT_TOKEN)) {
    throw new Error('TELEGRAM_BOT_TOKEN is required to start the Telegram Bot.');
  }

  if (!appUrl) {
    throw new Error('APP_URL is required to open the Telegram Mini App.');
  }

  return {
    TELEGRAM_BOT_TOKEN: botToken,
    APP_URL: normalizeUrl(appUrl),
    API_BASE_URL: normalizeUrl(apiBaseUrl),
    BOT_DRY_RUN: dryRun,
  };
}

function normalizeUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}
