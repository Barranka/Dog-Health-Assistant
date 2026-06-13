ALTER TABLE "knowledge_articles"
  ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'ru';

CREATE UNIQUE INDEX "knowledge_articles_category_locale_key"
  ON "knowledge_articles"("category", "locale");

CREATE INDEX "knowledge_articles_locale_idx"
  ON "knowledge_articles"("locale");
