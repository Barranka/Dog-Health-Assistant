import { Bot, Send } from 'lucide-react';

import { useI18n } from '../../i18n/useI18n.js';
import { InfoCard } from '../components/InfoCard.js';

export function SymptomAnalysisPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('symptoms.title')}</h2>
      <InfoCard>
        <Bot className="text-[var(--app-link)]" size={24} />
        <label className="mt-4 block text-sm font-medium" htmlFor="symptoms">
          {t('symptoms.descriptionLabel')}
        </label>
        <textarea
          className="mt-2 min-h-32 w-full resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 text-sm outline-none focus:border-[var(--app-link)]"
          id="symptoms"
          placeholder={t('symptoms.placeholder')}
        />
        <button className="primary-button mt-3 w-full justify-center" type="button">
          <Send size={18} />
          <span>{t('symptoms.submit')}</span>
        </button>
      </InfoCard>
    </div>
  );
}
