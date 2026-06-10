export interface UserProfile {
  id: string;
  telegramId: string;
  firstName: string | null;
  username: string | null;
  createdAt: Date;
}
