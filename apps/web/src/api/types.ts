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

export interface HeatCycleRecord {
  id: string;
  dogId: string;
  startDate: string;
  endDate: string | null;
  duration: number | null;
  status: 'active' | 'completed';
  predicted: boolean;
  notes: string | null;
  createdAt: string;
}

export interface CreateHeatCyclePayload {
  startDate: string;
  endDate?: string | null;
  predicted?: boolean;
  notes?: string | null;
}

export type UpdateHeatCyclePayload = Partial<CreateHeatCyclePayload>;

export type HealthEventType =
  | 'vaccination'
  | 'revaccination'
  | 'deworming'
  | 'tick_treatment'
  | 'flea_treatment'
  | 'weight_tracking'
  | 'vet_visit'
  | 'surgery'
  | 'other';

export interface HealthEventRecord {
  id: string;
  dogId: string;
  type: HealthEventType;
  title: string;
  eventDate: string;
  nextReminderDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateHealthEventPayload {
  type: HealthEventType;
  title: string;
  eventDate: string;
  nextReminderDate?: string | null;
  notes?: string | null;
}

export type UpdateHealthEventPayload = Partial<CreateHealthEventPayload>;

export type NotificationType = 'health_event_reminder' | 'heat_cycle_check' | 'heat_cycle_forecast';

export type NotificationStatus = 'unread' | 'read';

export interface NotificationRecord {
  id: string;
  userId: string;
  dogId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  scheduledAt: string;
  readAt: string | null;
  telegramSentAt: string | null;
  telegramError: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadNotificationsCount {
  unreadCount: number;
}

export type KnowledgeCategory =
  | 'proestrus'
  | 'estrus'
  | 'diestrus'
  | 'false_pregnancy'
  | 'postpartum'
  | 'vet_warning_signs';

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: KnowledgeCategory;
  group: string;
  locale: string;
  content: string;
  createdAt: string;
}
