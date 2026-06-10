import { Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useI18n } from '../../i18n/useI18n.js';
import { useTelegram } from '../../telegram/useTelegram.js';

export function TopBar() {
  const { user, isTelegram } = useTelegram();
  const { t } = useI18n();
  const displayName = user?.firstName ?? t('topBar.defaultOwner');

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--app-border)] bg-[var(--app-bg)]/95 px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] backdrop-blur">
      <div className="flex min-h-12 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-muted)]">
            {t('app.name')}
          </p>
          <h1 className="truncate text-lg font-semibold leading-6">{displayName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[var(--app-border)] px-2 py-1 text-xs text-[var(--app-muted)]">
            {isTelegram ? t('app.modeTelegram') : t('app.modePreview')}
          </span>
          <button className="icon-button" type="button" aria-label={t('app.notifications')}>
            <Bell size={19} />
          </button>
          <Link className="icon-button" to="/settings" aria-label={t('app.settings')}>
            <Settings size={19} />
          </Link>
        </div>
      </div>
    </header>
  );
}
