import type { KnowledgeCategory } from '@prisma/client';

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: KnowledgeCategory;
  group: string;
  locale: string;
  content: string;
  createdAt: Date;
}
