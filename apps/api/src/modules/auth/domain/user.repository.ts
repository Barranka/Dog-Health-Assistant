import type { AuthenticatedUser } from './authenticated-user.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UpsertTelegramUserInput {
  telegramId: string;
  firstName: string | null;
  username: string | null;
}

export interface UserRepository {
  findById(id: string): Promise<AuthenticatedUser | null>;
  upsertTelegramUser(input: UpsertTelegramUserInput): Promise<AuthenticatedUser>;
}
