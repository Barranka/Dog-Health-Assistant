import { Inject, Injectable } from '@nestjs/common';

import type { KnowledgeArticle } from '../domain/knowledge-article.js';
import {
  type FindKnowledgeArticlesInput,
  KNOWLEDGE_REPOSITORY,
  type KnowledgeRepository,
} from '../domain/knowledge.repository.js';

@Injectable()
export class ListKnowledgeArticlesUseCase {
  constructor(
    @Inject(KNOWLEDGE_REPOSITORY)
    private readonly knowledgeRepository: KnowledgeRepository,
  ) {}

  execute(input: FindKnowledgeArticlesInput): Promise<KnowledgeArticle[]> {
    return this.knowledgeRepository.findMany(input);
  }
}
