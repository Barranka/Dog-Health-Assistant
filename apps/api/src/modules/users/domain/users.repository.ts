import type { UserProfile } from './user-profile.js';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UpdateUserProfileInput {
  firstName?: string | null;
  username?: string | null;
}

export interface UsersRepository {
  findById(id: string): Promise<UserProfile | null>;
  updateById(id: string, input: UpdateUserProfileInput): Promise<UserProfile>;
  deleteById(id: string): Promise<void>;
}
