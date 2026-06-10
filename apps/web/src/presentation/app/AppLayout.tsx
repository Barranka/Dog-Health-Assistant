import { Outlet } from 'react-router-dom';

import { BottomNavigation } from '../navigation/BottomNavigation.js';
import { DesktopSidebar } from '../navigation/DesktopSidebar.js';
import { TopBar } from '../navigation/TopBar.js';

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <DesktopSidebar />
        <div className="flex min-h-dvh min-w-0 flex-col">
          <TopBar />
          <main className="flex-1 px-4 pb-[calc(82px+env(safe-area-inset-bottom))] pt-3 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
            <div className="mx-auto w-full max-w-[1040px]">
              <Outlet />
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}
