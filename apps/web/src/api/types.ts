export type DogSex = 'female' | 'male';

export interface AuthToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: AuthToken;
}

export interface UserProfile {
  id: string;
  telegramId: string;
  firstName: string | null;
  username: string | null;
  createdAt: string;
}

export interface DogProfile {
  id: string;
  userId: string;
  name: string;
  breed: string | null;
  sex: DogSex;
  birthDate: string | null;
  weight: number | null;
  color: string | null;
  sterilized: boolean;
  notes: string | null;
  createdAt: string;
}

export interface CreateDogPayload {
  name: string;
  breed?: string | null;
  sex: DogSex;
  birthDate?: string | null;
  weight?: number | null;
  color?: string | null;
  sterilized?: boolean;
  notes?: string | null;
}

export type UpdateDogPayload = Partial<CreateDogPayload>;

export interface TelegramLoginPayload {
  id: number;
  first_name?: string;
  username?: string;
  auth_date: number;
  hash: string;
}
