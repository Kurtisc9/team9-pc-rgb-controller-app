import { getSyncTruthLabel } from '@/domain/devices/truthRules';
import type { SyncTruthStatus } from '@/domain/devices/types';

interface StatusBadgeProps {
  status: SyncTruthStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{getSyncTruthLabel(status)}</span>;
}
