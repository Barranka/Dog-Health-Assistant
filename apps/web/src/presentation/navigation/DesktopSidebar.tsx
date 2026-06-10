import { NavLink } from 'react-router-dom';

import { useI18n } from '../../i18n/useI18n.js';
import { appNavigationItems } from './navigation-items.js';

export function DesktopSidebar() {
  const { t } = useI18n();

  return (
    <aside className="sticky top-0 hidden h-dvh border-r border-[var(--app-border)] bg-[var(--app-card)] px-4 py-5 lg:flex lg:flex-col">
      <div className="mb-7 px-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-muted)]">
          {t('app.name')}
        </p>
        <h1 className="mt-1 text-xl font-semibold">{t('desktop.workspace')}</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label={t('desktop.mainNavigation')}>
        {appNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end === true}
              className={({ isActive }) =>
                [
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--app-button)] text-[var(--app-button-text)]'
                    : 'text-[var(--app-muted)] hover:bg-[var(--app-surface)] hover:text-[var(--app-text)]',
                ].join(' ')
              }
            >
              <Icon size={19} aria-hidden="true" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 text-sm">
        <p className="font-semibold">{t('desktop.webMode')}</p>
        <p className="mt-1 leading-5 text-[var(--app-muted)]">{t('desktop.webModeDescription')}</p>
      </div>
    </aside>
  );
}
