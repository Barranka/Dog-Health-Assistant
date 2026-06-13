import type { KnowledgeCategory } from '@prisma/client';

import type { KnowledgeArticle } from './knowledge-article.js';

export const KNOWLEDGE_REPOSITORY = Symbol('KNOWLEDGE_REPOSITORY');

export interface FindKnowledgeArticlesInput {
  locale: string;
  group?: string;
  category?: KnowledgeCategory;
  search?: string;
}

export interface KnowledgeRepository {
  findMany(input: FindKnowledgeArticlesInput): Promise<KnowledgeArticle[]>;
  findById(id: string): Promise<KnowledgeArticle | null>;
}
