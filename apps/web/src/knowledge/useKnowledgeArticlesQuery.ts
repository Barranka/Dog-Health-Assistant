import { useQuery } from '@tanstack/react-query';

import { listKnowledgeArticles } from '../api/knowledgeApi.js';

export function useKnowledgeArticlesQuery(locale: string, group?: string, search?: string) {
  return useQuery({
    queryKey: ['knowledge', locale, group ?? null, search ?? ''],
    queryFn: () => {
      const params = { locale, group, search };

      return listKnowledgeArticles(params);
    },
  });
}
