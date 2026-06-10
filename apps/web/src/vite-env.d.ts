/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_TELEGRAM_BOT_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  colorScheme: 'light' | 'dark';
  ready: () => void;
  expand: () => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
  onTelegramLogin?: (user: TelegramLoginWidgetUser) => void;
}

interface TelegramLoginWidgetUser {
  id: number;
  first_name?: string;
  username?: string;
  auth_date: number;
  hash: string;
}
