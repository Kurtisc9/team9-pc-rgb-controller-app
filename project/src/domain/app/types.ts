import type { BackendHealthRecord } from '@/domain/backends/types';
import type { DeviceRecord } from '@/domain/devices/types';
import type { LibraryAsset, RecentAction } from '@/domain/library/types';

export type PersistenceMode = 'disk' | 'browser_mock';

export interface AppBootstrapState {
  devices: Record<string, DeviceRecord>;
  backendHealth: Record<string, BackendHealthRecord>;
  libraryAssets: Record<string, LibraryAsset>;
  recentActions: RecentAction[];
  selectedDisplayId: string | null;
  selectedLibraryAssetId: string | null;
  persistenceMode: PersistenceMode;
  libraryDirectory?: string;
  lastDiagnosticsExportPath?: string | null;
  lastDiagnosticsExportAt?: string | null;
}
