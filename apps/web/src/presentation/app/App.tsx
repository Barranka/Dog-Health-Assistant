import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './AppLayout.js';
import { CalendarPage } from '../pages/CalendarPage.js';
import { DogsPage } from '../pages/DogsPage.js';
import { HealthPage } from '../pages/HealthPage.js';
import { HeatCyclesPage } from '../pages/HeatCyclesPage.js';
import { HomePage } from '../pages/HomePage.js';
import { KnowledgePage } from '../pages/KnowledgePage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { SymptomAnalysisPage } from '../pages/SymptomAnalysisPage.js';
import { AuthGate } from '../../auth/AuthGate.js';
import { TelegramProvider } from '../../telegram/TelegramProvider.js';
import { I18nProvider } from '../../i18n/I18nProvider.js';
import { AuthProvider } from '../../auth/AuthProvider.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <I18nProvider>
          <AuthProvider>
            <BrowserRouter>
              <AuthGate>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="dogs" element={<DogsPage />} />
                    <Route path="heat-cycles" element={<HeatCyclesPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="health" element={<HealthPage />} />
                    <Route path="symptoms" element={<SymptomAnalysisPage />} />
                    <Route path="knowledge" element={<KnowledgePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </AuthGate>
            </BrowserRouter>
          </AuthProvider>
        </I18nProvider>
      </TelegramProvider>
    </QueryClientProvider>
  );
}
