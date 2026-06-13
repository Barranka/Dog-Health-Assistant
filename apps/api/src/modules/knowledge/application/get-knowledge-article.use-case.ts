import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { KnowledgeArticle } from '../domain/knowledge-article.js';
import { KNOWLEDGE_REPOSITORY, type KnowledgeRepository } from '../domain/knowledge.repository.js';

@Injectable()
export class GetKnowledgeArticleUseCase {
  constructor(
    @Inject(KNOWLEDGE_REPOSITORY)
    private readonly knowledgeRepository: KnowledgeRepository,
  ) {}

  async execute(id: string): Promise<KnowledgeArticle> {
    const article = await this.knowledgeRepository.findById(id);

    if (!article) {
      throw new NotFoundException('Knowledge article was not found.');
    }

    return article;
  }
}
