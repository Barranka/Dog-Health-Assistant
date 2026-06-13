import { Inject, Injectable } from '@nestjs/common';
import { Prisma, type KnowledgeCategory } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { KnowledgeArticle } from '../domain/knowledge-article.js';
import type {
  FindKnowledgeArticlesInput,
  KnowledgeRepository,
} from '../domain/knowledge.repository.js';

@Injectable()
export class PrismaKnowledgeRepository implements KnowledgeRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findMany(input: FindKnowledgeArticlesInput): Promise<KnowledgeArticle[]> {
    const where: Prisma.KnowledgeArticleWhereInput = {
      locale: input.locale,
    };

    if (input.group) {
      where.group = input.group;
    }

    if (input.category) {
      where.category = input.category;
    }

    if (input.search) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const articles = await this.prisma.knowledgeArticle.findMany({
      where,
      orderBy: {
        title: 'asc',
      },
    });

    return articles.map((article) => this.toKnowledgeArticle(article));
  }

  async findById(id: string): Promise<KnowledgeArticle | null> {
    const article = await this.prisma.knowledgeArticle.findUnique({
      where: {
        id,
      },
    });

    return article ? this.toKnowledgeArticle(article) : null;
  }

  private toKnowledgeArticle(article: {
    id: string;
    slug: string;
    title: string;
    category: KnowledgeCategory;
    group: string;
    locale: string;
    content: string;
    createdAt: Date;
  }): KnowledgeArticle {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category,
      group: article.group,
      locale: article.locale,
      content: article.content,
      createdAt: article.createdAt,
    };
  }
}
