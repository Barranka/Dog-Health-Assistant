import { Outlet } from 'react-router-dom';

import { BottomNavigation } from '../navigation/BottomNavigation.js';
import { TopBar } from '../navigation/TopBar.js';

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col">
        <TopBar />
        <main className="flex-1 px-4 pb-[calc(82px+env(safe-area-inset-bottom))] pt-3">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
