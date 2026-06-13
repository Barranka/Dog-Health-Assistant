import { Module } from '@nestjs/common';

import { GetKnowledgeArticleUseCase } from './application/get-knowledge-article.use-case.js';
import { ListKnowledgeArticlesUseCase } from './application/list-knowledge-articles.use-case.js';
import { KNOWLEDGE_REPOSITORY } from './domain/knowledge.repository.js';
import { PrismaKnowledgeRepository } from './infrastructure/prisma-knowledge.repository.js';
import { KnowledgeController } from './presentation/knowledge.controller.js';

@Module({
  controllers: [KnowledgeController],
  providers: [
    GetKnowledgeArticleUseCase,
    ListKnowledgeArticlesUseCase,
    {
      provide: KNOWLEDGE_REPOSITORY,
      useClass: PrismaKnowledgeRepository,
    },
  ],
})
export class KnowledgeModule {}
