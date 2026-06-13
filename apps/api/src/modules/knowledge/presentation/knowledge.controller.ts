import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { KnowledgeCategory } from '@prisma/client';

import { GetKnowledgeArticleUseCase } from '../application/get-knowledge-article.use-case.js';
import { ListKnowledgeArticlesUseCase } from '../application/list-knowledge-articles.use-case.js';
import type { FindKnowledgeArticlesInput } from '../domain/knowledge.repository.js';
import { KnowledgeArticleResponseDto } from './dto/knowledge-article-response.dto.js';

const knowledgeCategories = [
  'proestrus',
  'estrus',
  'diestrus',
  'false_pregnancy',
  'postpartum',
  'vet_warning_signs',
] as const satisfies readonly KnowledgeCategory[];

@ApiTags('Knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(
    @Inject(ListKnowledgeArticlesUseCase)
    private readonly listKnowledgeArticlesUseCase: ListKnowledgeArticlesUseCase,
    @Inject(GetKnowledgeArticleUseCase)
    private readonly getKnowledgeArticleUseCase: GetKnowledgeArticleUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List knowledge base articles' })
  @ApiQuery({ name: 'locale', required: false, enum: ['ru', 'en'] })
  @ApiQuery({ name: 'group', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, enum: knowledgeCategories })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ type: KnowledgeArticleResponseDto, isArray: true })
  listArticles(
    @Query('locale') locale = 'ru',
    @Query('group') group?: string,
    @Query('category') category?: KnowledgeCategory,
    @Query('search') search?: string,
  ): Promise<KnowledgeArticleResponseDto[]> {
    const input: FindKnowledgeArticlesInput = {
      locale: this.normalizeLocale(locale),
    };
    const normalizedGroup = this.normalizeQueryValue(group);
    const normalizedSearch = this.normalizeQueryValue(search);

    if (normalizedGroup) {
      input.group = normalizedGroup;
    }

    if (category) {
      input.category = category;
    }

    if (normalizedSearch) {
      input.search = normalizedSearch;
    }

    return this.listKnowledgeArticlesUseCase.execute(input);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge base article by id' })
  @ApiOkResponse({ type: KnowledgeArticleResponseDto })
  getArticle(@Param('id') id: string): Promise<KnowledgeArticleResponseDto> {
    return this.getKnowledgeArticleUseCase.execute(id);
  }

  private normalizeLocale(locale: string): string {
    return locale === 'en' ? 'en' : 'ru';
  }

  private normalizeQueryValue(value: string | undefined): string | undefined {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : undefined;
  }
}
