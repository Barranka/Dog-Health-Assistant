import { Bell } from 'lucide-react';
import { useState } from 'react';

import { useI18n } from '../../i18n/useI18n.js';
import { useNotificationsQuery } from '../useNotificationsQuery.js';
import { useUnreadNotificationsCountQuery } from '../useUnreadNotificationsCountQuery.js';
import { useMarkAllNotificationsReadMutation } from '../useMarkAllNotificationsReadMutation.js';
import { useMarkNotificationReadMutation } from '../useMarkNotificationReadMutation.js';

export function NotificationBell() {
  const { t } = useI18n();
  const { data } = useUnreadNotificationsCountQuery();
  const unreadCount = data?.unreadCount ?? 0;
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const markReadMutation = useMarkNotificationReadMutation();

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)]"
        aria-label={t('app.notifications')}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <Bell size={18} aria-hidden="true" />

        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-xs font-semibold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="fixed left-4 right-4 top-[calc(4.5rem+env(safe-area-inset-top))] z-30 max-h-[min(70vh,28rem)] overflow-hidden rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-80">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--app-text)]">{t('app.notifications')}</p>

            {unreadCount > 0 ? (
              <button
                type="button"
                className="shrink-0 text-xs font-medium text-[var(--app-link)] disabled:opacity-60"
                disabled={markAllReadMutation.isPending}
                onClick={() => markAllReadMutation.mutate()}
              >
                {t('app.notificationsReadAll')}
              </button>
            ) : null}
          </div>

          <div className="mt-3 max-h-[min(56vh,22rem)] space-y-2 overflow-y-auto pr-1">
            {isLoading ? (
              <p className="text-sm text-[var(--app-muted)]">{t('app.notificationsLoading')}</p>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={
                    notification.status === 'unread'
                      ? 'w-full rounded-md border border-[var(--app-link)] bg-[var(--app-link-soft)] p-2 text-left'
                      : 'w-full rounded-md border border-[var(--app-border)] p-2 text-left'
                  }
                  onClick={() => {
                    if (notification.status === 'unread') {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                >
                  <p className="text-sm font-medium text-[var(--app-text)]">{notification.title}</p>
                  <p className="mt-1 text-xs text-[var(--app-muted)]">{notification.message}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-[var(--app-muted)]">{t('app.notificationsEmpty')}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
