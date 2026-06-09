export interface AuthenticatedUser {
  id: string;
  telegramId: string;
  firstName: string | null;
  username: string | null;
}
