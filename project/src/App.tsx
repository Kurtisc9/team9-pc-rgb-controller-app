import { useEffect } from 'react';
import { AppRouter } from '@/app/router/AppRouter';
import { useAppStore } from '@/app/store/useAppStore';

export default function App() {
  const bootstrapAppState = useAppStore((state) => state.bootstrapAppState);

  useEffect(() => {
    void bootstrapAppState();
  }, [bootstrapAppState]);

  return <AppRouter />;
}
