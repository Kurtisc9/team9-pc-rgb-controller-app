import { useCallback, useEffect, useState } from 'react';
import type { Team9BootstrapState } from '../types/team9';
import { getBridge } from '../lib/getBridge';

export function useBootstrap() {
  const [data, setData] = useState<Team9BootstrapState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getBridge().getStateBootstrap();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bootstrap failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    loading,
    error,
    reload,
  };
}
