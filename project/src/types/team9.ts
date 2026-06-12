export type Team9DisplayMode = 'image' | 'video' | 'clock' | 'system' | 'off';
export type Team9AssetType = 'image' | 'video' | 'gif' | 'other';

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
    statuses?: string[];
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
  setSelectedDisplay: (deviceId: string) => Promise<Team9Result>;
  selectLibraryAsset: (assetId: string) => Promise<Team9Result>;
}
