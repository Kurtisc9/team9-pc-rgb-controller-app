import { useEffect, useState } from 'react';
import type { Team9BootstrapState } from '../types/team9';
import { getBridge } from '../lib/getBridge';

export function useBootstrap() {
  const [data, setData] = useState<Team9BootstrapState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const result = await getBridge().getStateBootstrap();
        if (mounted) setData(result);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Bootstrap failed');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
