/// <reference types="vite/client" />

import type { AppBootstrapState } from '@/domain/app/types';
import type { DeviceRecord } from '@/domain/devices/types';

interface Team9Bridge {
  getAppInfo: () => Promise<{
    appName: string;
    version: string;
    packaged: boolean;
    platform: string;
  }>;
  getStateBootstrap: () => Promise<AppBootstrapState>;
  refreshBackendHealth: () => Promise<AppBootstrapState>;
  exportDiagnosticsReport: () => Promise<AppBootstrapState>;
  runMachineCapture: () => Promise<AppBootstrapState>;
  openDiagnosticsFolder: () => Promise<string | null>;
  importLibraryFiles: () => Promise<AppBootstrapState>;
  toggleLibraryFavorite: (assetId: string) => Promise<AppBootstrapState>;
  deleteLibraryAsset: (assetId: string) => Promise<AppBootstrapState>;
  assignAssetToDisplay: (deviceId: string, assetId: string) => Promise<AppBootstrapState>;
  setDisplayMode: (
    deviceId: string,
    mode: NonNullable<DeviceRecord['displayState']>['currentMode'],
  ) => Promise<AppBootstrapState>;
  setSelectedDisplay: (deviceId: string) => Promise<AppBootstrapState>;
  selectLibraryAsset: (assetId: string | null) => Promise<AppBootstrapState>;
}

declare global {
  interface Window {
    team9Bridge?: Team9Bridge;
  }
}

export {};
