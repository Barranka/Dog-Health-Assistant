ALTER TABLE "knowledge_articles"
  ADD COLUMN "slug" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "group" TEXT NOT NULL DEFAULT 'reproductive_cycle';

UPDATE "knowledge_articles"
SET "slug" = "category"::TEXT
WHERE "slug" = '';

CREATE UNIQUE INDEX "knowledge_articles_slug_locale_key"
  ON "knowledge_articles"("slug", "locale");

CREATE INDEX "knowledge_articles_group_idx"
  ON "knowledge_articles"("group");
