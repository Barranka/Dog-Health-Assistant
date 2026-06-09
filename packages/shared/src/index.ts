export type Identifier = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export enum DogSex {
  Female = 'female',
  Male = 'male',
}

export enum HealthEventType {
  Vaccination = 'vaccination',
  Revaccination = 'revaccination',
  Deworming = 'deworming',
  TickTreatment = 'tick_treatment',
  FleaTreatment = 'flea_treatment',
  VetVisit = 'vet_visit',
  Surgery = 'surgery',
  Other = 'other',
}

export enum ReminderType {
  HeatCycle = 'heat_cycle',
  HealthEvent = 'health_event',
  Custom = 'custom',
}

export enum SymptomRiskLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum KnowledgeCategory {
  Proestrus = 'proestrus',
  Estrus = 'estrus',
  Diestrus = 'diestrus',
  FalsePregnancy = 'false_pregnancy',
  Postpartum = 'postpartum',
  VetWarningSigns = 'vet_warning_signs',
}

export interface UserContract {
  id: Identifier;
  telegramId: string;
  firstName: Nullable<string>;
  username: Nullable<string>;
  createdAt: ISODateString;
}

export interface DogContract {
  id: Identifier;
  userId: Identifier;
  name: string;
  breed: Nullable<string>;
  sex: DogSex;
  birthDate: Nullable<ISODateString>;
  weight: Nullable<number>;
  color: Nullable<string>;
  sterilized: boolean;
  notes: Nullable<string>;
  createdAt: ISODateString;
}

export interface HeatCycleContract {
  id: Identifier;
  dogId: Identifier;
  startDate: ISODateString;
  endDate: Nullable<ISODateString>;
  duration: Nullable<number>;
  predicted: boolean;
  notes: Nullable<string>;
  createdAt: ISODateString;
}

export interface HealthEventContract {
  id: Identifier;
  dogId: Identifier;
  type: HealthEventType;
  title: string;
  eventDate: ISODateString;
  nextReminderDate: Nullable<ISODateString>;
  notes: Nullable<string>;
  createdAt: ISODateString;
}

export interface ReminderContract {
  id: Identifier;
  dogId: Identifier;
  type: ReminderType;
  reminderDate: ISODateString;
  sent: boolean;
  createdAt: ISODateString;
}

export interface SymptomReportContract {
  id: Identifier;
  dogId: Identifier;
  text: string;
  aiAnalysis: Nullable<string>;
  riskLevel: Nullable<SymptomRiskLevel>;
  createdAt: ISODateString;
}

export interface KnowledgeArticleContract {
  id: Identifier;
  title: string;
  category: KnowledgeCategory;
  content: string;
  createdAt: ISODateString;
}
