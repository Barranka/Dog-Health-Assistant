import { BookOpen } from 'lucide-react';

import type { TranslationKey } from '../../i18n/dictionaries.js';
import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

const articles = [
  'knowledge.proestrus',
  'knowledge.estrus',
  'knowledge.diestrus',
  'knowledge.falsePregnancy',
  'knowledge.vetWarningSigns',
] as const satisfies ReadonlyArray<TranslationKey>;

export function KnowledgePage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('knowledge.title')}</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <InfoCard key={article}>
            <div className="flex items-center gap-3">
              <BookOpen className="text-[var(--app-link)]" size={22} />
              <p className="font-semibold">{t(article)}</p>
            </div>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}
