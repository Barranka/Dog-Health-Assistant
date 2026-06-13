import { apiRequest } from './apiClient.js';
import type { KnowledgeArticle } from './types.js';

interface ListKnowledgeArticlesParams {
  locale: string;
  group?: string | undefined;
  search?: string | undefined;
}

export function listKnowledgeArticles({
  locale,
  group,
  search,
}: ListKnowledgeArticlesParams): Promise<KnowledgeArticle[]> {
  const searchParams = new URLSearchParams({
    locale,
  });

  if (group) {
    searchParams.set('group', group);
  }

  if (search) {
    searchParams.set('search', search);
  }

  return apiRequest<KnowledgeArticle[]>(`/knowledge?${searchParams.toString()}`);
}
