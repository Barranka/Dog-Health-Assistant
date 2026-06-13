import { ApiProperty } from '@nestjs/swagger';
import type { KnowledgeCategory } from '@prisma/client';

export class KnowledgeArticleResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  slug!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({
    enum: ['proestrus', 'estrus', 'diestrus', 'false_pregnancy', 'postpartum', 'vet_warning_signs'],
    enumName: 'KnowledgeCategory',
  })
  category!: KnowledgeCategory;

  @ApiProperty({ type: String })
  group!: string;

  @ApiProperty({ type: String })
  locale!: string;

  @ApiProperty({ type: String })
  content!: string;

  @ApiProperty({ type: Date })
  createdAt!: Date;
}
