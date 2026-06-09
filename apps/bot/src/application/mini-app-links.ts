import type { BotEnvironment } from '../config/bot-environment.js';

export interface MiniAppLinks {
  home: string;
  dogs: string;
  calendar: string;
  health: string;
  knowledge: string;
}

export function createMiniAppLinks(environment: BotEnvironment): MiniAppLinks {
  return {
    home: environment.APP_URL,
    dogs: `${environment.APP_URL}/dogs`,
    calendar: `${environment.APP_URL}/calendar`,
    health: `${environment.APP_URL}/health`,
    knowledge: `${environment.APP_URL}/knowledge`,
  };
}
