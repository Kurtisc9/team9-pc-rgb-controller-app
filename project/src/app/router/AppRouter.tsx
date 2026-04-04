import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';
import { LcdMediaPage } from '@/features/lcd-media/LcdMediaPage';
import { LibraryPage } from '@/features/library/LibraryPage';
import { RgbPage } from '@/features/rgb/RgbPage';
import { SettingsPage } from '@/features/settings/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/lcd-media" element={<LcdMediaPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/rgb" element={<RgbPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
