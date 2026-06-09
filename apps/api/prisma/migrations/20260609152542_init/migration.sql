-- CreateEnum
CREATE TYPE "DogSex" AS ENUM ('female', 'male');

-- CreateEnum
CREATE TYPE "HealthEventType" AS ENUM ('vaccination', 'revaccination', 'deworming', 'tick_treatment', 'flea_treatment', 'vet_visit', 'surgery', 'other');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('heat_cycle', 'health_event', 'custom');

-- CreateEnum
CREATE TYPE "SymptomRiskLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "KnowledgeCategory" AS ENUM ('proestrus', 'estrus', 'diestrus', 'false_pregnancy', 'postpartum', 'vet_warning_signs');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "firstName" TEXT,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dogs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "sex" "DogSex" NOT NULL,
    "birthDate" TIMESTAMP(3),
    "weight" DECIMAL(6,2),
    "color" TEXT,
    "sterilized" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heat_cycles" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "duration" INTEGER,
    "predicted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heat_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_events" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "type" "HealthEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "nextReminderDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptom_reports" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "aiAnalysis" TEXT,
    "riskLevel" "SymptomRiskLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symptom_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "KnowledgeCategory" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramId_key" ON "users"("telegramId");

-- CreateIndex
CREATE INDEX "dogs_userId_idx" ON "dogs"("userId");

-- CreateIndex
CREATE INDEX "heat_cycles_dogId_idx" ON "heat_cycles"("dogId");

-- CreateIndex
CREATE INDEX "heat_cycles_startDate_idx" ON "heat_cycles"("startDate");

-- CreateIndex
CREATE INDEX "health_events_dogId_idx" ON "health_events"("dogId");

-- CreateIndex
CREATE INDEX "health_events_eventDate_idx" ON "health_events"("eventDate");

-- CreateIndex
CREATE INDEX "health_events_nextReminderDate_idx" ON "health_events"("nextReminderDate");

-- CreateIndex
CREATE INDEX "reminders_dogId_idx" ON "reminders"("dogId");

-- CreateIndex
CREATE INDEX "reminders_reminderDate_idx" ON "reminders"("reminderDate");

-- CreateIndex
CREATE INDEX "reminders_sent_idx" ON "reminders"("sent");

-- CreateIndex
CREATE INDEX "symptom_reports_dogId_idx" ON "symptom_reports"("dogId");

-- CreateIndex
CREATE INDEX "symptom_reports_riskLevel_idx" ON "symptom_reports"("riskLevel");

-- CreateIndex
CREATE INDEX "knowledge_articles_category_idx" ON "knowledge_articles"("category");

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heat_cycles" ADD CONSTRAINT "heat_cycles_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_events" ADD CONSTRAINT "health_events_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptom_reports" ADD CONSTRAINT "symptom_reports_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
