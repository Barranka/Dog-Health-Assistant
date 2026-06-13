import {
  AlertTriangle,
  ArrowLeft,
  HeartPulse,
  HelpCircle,
  Search,
  Share2,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import type { KnowledgeArticle } from '../../api/types.js';
import type { TranslationKey } from '../../i18n/dictionaries.js';
import { useI18n } from '../../i18n/useI18n.js';
import { useKnowledgeArticlesQuery } from '../../knowledge/useKnowledgeArticlesQuery.js';
import { InfoCard } from '../components/InfoCard.js';

interface KnowledgeGroup {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: LucideIcon;
}

const knowledgeGroups: KnowledgeGroup[] = [
  {
    id: 'reproductive_cycle',
    titleKey: 'knowledge.reproductiveCycleTitle',
    descriptionKey: 'knowledge.reproductiveCycleDescription',
    icon: HeartPulse,
  },
  {
    id: 'dangerous_symptoms',
    titleKey: 'knowledge.symptomsTitle',
    descriptionKey: 'knowledge.symptomsDescription',
    icon: AlertTriangle,
  },
  {
    id: 'prevention_and_health',
    titleKey: 'knowledge.preventionTitle',
    descriptionKey: 'knowledge.preventionDescription',
    icon: Star,
  },
  {
    id: 'faq',
    titleKey: 'knowledge.faqTitle',
    descriptionKey: 'knowledge.faqDescription',
    icon: HelpCircle,
  },
];

const recentStorageKey = 'dog-health-recent-knowledge';

const knowledgeArticleOrder = [
  'what-is-heat',
  'first-heat',
  'cycle-phases',
  'proestrus',
  'estrus',
  'diestrus',
  'anestrus',
  'ovulation-and-fertility',
  'heat-behavior',
  'heat-care',
  'heat-hygiene',
  'bathing-during-heat',
  'normal-cycle-signs',
  'urgent-vet',
  'discharge-warning-signs',
  'pyometra',
  'cycle-disorders',
  'fever',
  'food-water-refusal',
  'red-flags-after-heat',
  'vaccination',
  'tick-treatment',
  'flea-treatment',
  'deworming',
  'planned-vet-visit',
  'sterilization',
  'sterilization-timing',
  'sterilization-myths',
  'heat-duration-faq',
  'walking-during-heat',
  'activity-changes',
  'delayed-heat',
  'vet-after-heat',
];

const knowledgeArticleOrderBySlug = new Map(
  knowledgeArticleOrder.map((slug, index) => [slug, index]),
);

export function KnowledgePage() {
  const { locale, t } = useI18n();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteArticleIds, setFavoriteArticleIds] = useState<Set<string>>(() => new Set());
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);
  const [recentArticleIds, setRecentArticleIds] = useState<string[]>(() => readRecentArticleIds());
  const {
    data: articles = [],
    isLoading,
    error,
  } = useKnowledgeArticlesQuery(locale, selectedGroupId ?? undefined, searchQuery);
  const { data: allArticles = [] } = useKnowledgeArticlesQuery(locale);
  const sortedArticles = useMemo(() => sortKnowledgeArticles(articles), [articles]);
  const sortedAllArticles = useMemo(() => sortKnowledgeArticles(allArticles), [allArticles]);
  const selectedGroup = knowledgeGroups.find((group) => group.id === selectedGroupId) ?? null;
  const selectedArticle =
    articles.find((article) => article.id === selectedArticleId) ??
    allArticles.find((article) => article.id === selectedArticleId) ??
    null;
  const articleCountByGroup = useMemo(
    () =>
      sortedAllArticles.reduce<Record<string, number>>((counts, article) => {
        counts[article.group] = (counts[article.group] ?? 0) + 1;

        return counts;
      }, {}),
    [sortedAllArticles],
  );
  const favoriteArticles = sortedAllArticles.filter((article) =>
    favoriteArticleIds.has(article.id),
  );
  const recentArticles = recentArticleIds
    .map((articleId) => sortedAllArticles.find((article) => article.id === articleId))
    .filter((article): article is KnowledgeArticle => Boolean(article));
  const relatedArticles = selectedArticle
    ? sortKnowledgeArticles(
        sortedAllArticles.filter(
          (article) =>
            article.id !== selectedArticle.id &&
            (article.group === selectedArticle.group ||
              article.category === selectedArticle.category),
        ),
      ).slice(0, 3)
    : [];

  function openGroup(groupId: string): void {
    setSelectedGroupId(groupId);
    setSelectedArticleId(null);
    setSearchQuery('');
  }

  function openArticle(articleId: string): void {
    setSelectedArticleId(articleId);
    setRecentArticleIds((currentIds) => updateRecentArticleIds(articleId, currentIds));
  }

  function goBack(): void {
    if (selectedArticleId) {
      setSelectedArticleId(null);

      return;
    }

    setSelectedGroupId(null);
    setSearchQuery('');
  }

  async function shareArticle(article: KnowledgeArticle): Promise<void> {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.title,
      });

      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopiedArticleId(article.id);
  }

  function toggleFavorite(articleId: string): void {
    setFavoriteArticleIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(articleId)) {
        nextIds.delete(articleId);
      } else {
        nextIds.add(articleId);
      }

      return nextIds;
    });
  }

  if (selectedArticle) {
    return (
      <div className="space-y-4">
        <button
          className="inline-flex items-center gap-2 text-sm font-medium leading-none text-[var(--app-link)]"
          type="button"
          onClick={goBack}
        >
          <ArrowLeft className="shrink-0" size={18} />
          <span>{selectedGroup ? t(selectedGroup.titleKey) : t('knowledge.title')}</span>
        </button>

        <InfoCard>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
              <div className="flex shrink-0 gap-2">
                <button
                  className="icon-button"
                  type="button"
                  aria-label={
                    copiedArticleId === selectedArticle.id
                      ? t('knowledge.copied')
                      : t('knowledge.share')
                  }
                  title={
                    copiedArticleId === selectedArticle.id
                      ? t('knowledge.copied')
                      : t('knowledge.share')
                  }
                  onClick={() => void shareArticle(selectedArticle)}
                >
                  <Share2 size={18} />
                </button>
                <button
                  className="icon-button"
                  type="button"
                  aria-label={t('knowledge.favorites')}
                  onClick={() => toggleFavorite(selectedArticle.id)}
                >
                  <Star
                    className={
                      favoriteArticleIds.has(selectedArticle.id)
                        ? 'fill-[var(--app-link)] text-[var(--app-link)]'
                        : undefined
                    }
                    size={18}
                  />
                </button>
              </div>
            </div>
            <p className="whitespace-pre-line text-sm leading-6 text-[var(--app-muted)]">
              {selectedArticle.content}
            </p>
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 text-sm leading-5 text-[var(--app-muted)]">
              <p className="font-medium text-[var(--app-text)]">
                {t('knowledge.referenceNoteTitle')}
              </p>
              <p className="mt-2">{t('knowledge.referenceNoteDescription')}</p>
              <p className="mt-2">{t('knowledge.trackingHint')}</p>
            </div>
          </div>
        </InfoCard>

        {relatedArticles.length > 0 ? (
          <ArticleSection
            title={t('knowledge.related')}
            articles={relatedArticles}
            onOpenArticle={openArticle}
          />
        ) : null}
      </div>
    );
  }

  if (selectedGroup) {
    return (
      <div className="space-y-4">
        <button
          className="inline-flex items-center gap-2 text-sm font-medium leading-none text-[var(--app-link)]"
          type="button"
          onClick={goBack}
        >
          <ArrowLeft className="shrink-0" size={18} />
          <span>{t('knowledge.title')}</span>
        </button>
        <div>
          <h2 className="text-xl font-semibold">{t(selectedGroup.titleKey)}</h2>
          <p className="mt-1 text-sm text-[var(--app-muted)]">{t(selectedGroup.descriptionKey)}</p>
        </div>
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-3 text-[var(--app-muted)]"
            size={18}
          />
          <input
            className="min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-10 py-2 text-base outline-none focus:border-[var(--app-link)]"
            type="search"
            value={searchQuery}
            placeholder={t('knowledge.search')}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <KnowledgeState isLoading={isLoading} error={error} empty={sortedArticles.length === 0} />
        <div className="space-y-3">
          {sortedArticles.map((article) => (
            <ArticleListItem key={article.id} article={article} onOpenArticle={openArticle} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('knowledge.title')}</h2>
      <KnowledgeState isLoading={isLoading} error={error} empty={sortedAllArticles.length === 0} />
      <div className="grid gap-3 sm:grid-cols-2">
        {knowledgeGroups.map((group) => {
          const Icon = group.icon;

          return (
            <button
              key={group.id}
              type="button"
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-4 text-left shadow-sm"
              onClick={() => openGroup(group.id)}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 shrink-0 text-[var(--app-link)]" size={22} />
                <div className="min-w-0">
                  <p className="font-semibold">{t(group.titleKey)}</p>
                  <p className="mt-1 text-sm leading-5 text-[var(--app-muted)]">
                    {t(group.descriptionKey)}
                  </p>
                  <p className="mt-3 text-xs font-medium text-[var(--app-link)]">
                    {articleCountByGroup[group.id] ?? 0} {t('knowledge.articlesCount')}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {favoriteArticles.length > 0 ? (
        <ArticleSection
          title={t('knowledge.favorites')}
          articles={favoriteArticles}
          onOpenArticle={openArticle}
        />
      ) : null}

      {recentArticles.length > 0 ? (
        <ArticleSection
          title={t('knowledge.recent')}
          articles={recentArticles}
          onOpenArticle={openArticle}
        />
      ) : null}
    </div>
  );
}

interface KnowledgeStateProps {
  isLoading: boolean;
  error: unknown;
  empty: boolean;
}

function KnowledgeState({ isLoading, error, empty }: KnowledgeStateProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <InfoCard>
        <p className="text-sm text-[var(--app-muted)]">{t('knowledge.loading')}</p>
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard>
        <p className="text-sm text-[var(--app-muted)]">{t('knowledge.loadError')}</p>
      </InfoCard>
    );
  }

  if (empty) {
    return (
      <InfoCard>
        <p className="text-sm text-[var(--app-muted)]">{t('knowledge.empty')}</p>
      </InfoCard>
    );
  }

  return null;
}

interface ArticleListItemProps {
  article: KnowledgeArticle;
  onOpenArticle: (articleId: string) => void;
}

function ArticleListItem({ article, onOpenArticle }: ArticleListItemProps) {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-4 text-left shadow-sm"
      onClick={() => onOpenArticle(article.id)}
    >
      <p className="font-semibold">{article.title}</p>
      <p className="mt-2 line-clamp-3 text-sm leading-5 text-[var(--app-muted)]">
        {article.content}
      </p>
    </button>
  );
}

interface ArticleSectionProps {
  title: string;
  articles: KnowledgeArticle[];
  onOpenArticle: (articleId: string) => void;
}

function ArticleSection({ title, articles, onOpenArticle }: ArticleSectionProps) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--app-muted)]">{title}</h3>
      <div className="space-y-2">
        {articles.map((article) => (
          <ArticleListItem key={article.id} article={article} onOpenArticle={onOpenArticle} />
        ))}
      </div>
    </section>
  );
}

function sortKnowledgeArticles(articles: KnowledgeArticle[]): KnowledgeArticle[] {
  return [...articles].sort((firstArticle, secondArticle) => {
    const firstOrder =
      knowledgeArticleOrderBySlug.get(firstArticle.slug) ?? Number.MAX_SAFE_INTEGER;
    const secondOrder =
      knowledgeArticleOrderBySlug.get(secondArticle.slug) ?? Number.MAX_SAFE_INTEGER;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return firstArticle.title.localeCompare(secondArticle.title);
  });
}

function readRecentArticleIds(): string[] {
  try {
    const rawValue = window.localStorage.getItem(recentStorageKey);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : [];

    return Array.isArray(parsedValue) && parsedValue.every((value) => typeof value === 'string')
      ? parsedValue
      : [];
  } catch {
    return [];
  }
}

function updateRecentArticleIds(articleId: string, currentIds: string[]): string[] {
  const nextIds = [articleId, ...currentIds.filter((currentId) => currentId !== articleId)].slice(
    0,
    5,
  );

  window.localStorage.setItem(recentStorageKey, JSON.stringify(nextIds));

  return nextIds;
}
