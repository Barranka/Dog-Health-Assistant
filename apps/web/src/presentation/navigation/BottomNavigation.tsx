import { NavLink } from 'react-router-dom';

import { useI18n } from '../../i18n/useI18n.js';
import { primaryNavigationItems } from './navigation-items.js';

export function BottomNavigation() {
  const { t } = useI18n();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--app-border)] bg-[var(--app-bg)]/96 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-[760px] grid-cols-5 gap-1">
        {primaryNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end === true}
              className={({ isActive }) =>
                [
                  'flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition',
                  isActive
                    ? 'bg-[var(--app-button)] text-[var(--app-button-text)]'
                    : 'text-[var(--app-muted)] hover:bg-[var(--app-surface)]',
                ].join(' ')
              }
            >
              <Icon size={20} aria-hidden="true" />
              <span className="max-w-full truncate px-1">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
