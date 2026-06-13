export type Team9DisplayMode = 'image' | 'video' | 'clock' | 'system' | 'off';
export type Team9AssetType = 'image' | 'video' | 'gif' | 'other';
export type Team9SafePreset = 'off' | 'static-white' | 'static-red' | 'static-green' | 'static-blue' | 'rainbow-preview';

export interface Team9Device {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  displayPath: string;
  rgbPath: string;
  syncTruth: string;
  status?: string;
  assignedAssetId?: string | null;
  mode?: Team9DisplayMode;
}

export interface Team9LibraryAsset {
  id: string;
  name: string;
  path: string;
  favorite: boolean;
  type: Team9AssetType;
}

export interface Team9HardwareBackend {
  id: string;
  label: string;
  available: boolean;
  confidence: 'none' | 'medium' | 'high';
  verificationStatus: string;
  runtimeProcesses: string[];
  installPaths: string[];
  controls: string[];
  lastCheckAt: string;
  safeMode: boolean;
  writeAccess: boolean;
}

export interface Team9HardwareScan {
  ok: boolean;
  scannedAt: string;
  platform: string;
  arch: string;
  hostname: string;
  machine: {
    cpus: number;
    totalMemoryGB: number;
    freeMemoryGB: number;
  };
  summary: string;
  sync: string;
  backends: Team9HardwareBackend[];
  warnings: string[];
}

export interface Team9BootstrapState {
  ok: boolean;
  app: {
    mode: string;
    priority: string;
  };
  devices: Team9Device[];
  selectedDisplayId: string | null;
  library: Team9LibraryAsset[];
  selectedAssetId: string | null;
  diagnostics: {
    backend: string;
    sync: string;
    scannedAt?: string | null;
    statuses?: string[];
    hardware?: Team9HardwareScan | null;
  };
  pages?: string[];
}

export interface Team9Result {
  ok: boolean;
  reason?: string;
  message?: string;
  note?: string;
  [key: string]: unknown;
}

export interface Team9Bridge {
  getAppInfo: () => Promise<Team9Result>;
  getStateBootstrap: () => Promise<Team9BootstrapState>;
  refreshBackendHealth: () => Promise<Team9Result>;
  exportDiagnosticsReport: () => Promise<Team9Result>;
  runMachineCapture: () => Promise<Team9Result>;
  openDiagnosticsFolder: () => Promise<Team9Result>;
  importLibraryFiles: () => Promise<Team9LibraryAsset[]>;
  toggleLibraryFavorite: (assetId: string) => Promise<Team9Result>;
  deleteLibraryAsset: (assetId: string) => Promise<Team9Result>;
  assignAssetToDisplay: (deviceId: string, assetId: string) => Promise<Team9Result>;
  setDisplayMode: (deviceId: string, mode: Team9DisplayMode) => Promise<Team9Result>;
  stageSafePreset: (deviceId: string, presetId: Team9SafePreset, confirmed: boolean) => Promise<Team9Result>;
  setSelectedDisplay: (deviceId: string) => Promise<Team9Result>;
  selectLibraryAsset: (assetId: string) => Promise<Team9Result>;
}
