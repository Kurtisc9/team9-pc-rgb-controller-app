export type Team9AppInfo = {
  appName: string;
  version: string;
  isPackaged: boolean;
  platform: string;
};

export type Team9BootstrapState = {
  ok: boolean;
  app: {
    mode: string;
    priority: string;
  };
  devices: Array<{
    id: string;
    name: string;
    subtitle?: string;
    category: string;
    displayPath: string;
    rgbPath: string;
    syncTruth: string;
  }>;
  selectedDisplayId: string;
  library: Array<{
    id: string;
    name: string;
    path: string;
    favorite: boolean;
    type: string;
  }>;
  diagnostics: {
    backend: string;
    sync: string;
    statuses: string[];
  };
  pages: string[];
};

declare global {
  interface Window {
    team9Bridge: {
      getAppInfo: () => Promise<Team9AppInfo>;
      getStateBootstrap: () => Promise<Team9BootstrapState>;
      refreshBackendHealth: () => Promise<any>;
      exportDiagnosticsReport: () => Promise<any>;
      runMachineCapture: () => Promise<any>;
      openDiagnosticsFolder: () => Promise<any>;
      importLibraryFiles: () => Promise<any[]>;
      toggleLibraryFavorite: (assetId: string) => Promise<any>;
      deleteLibraryAsset: (assetId: string) => Promise<any>;
      assignAssetToDisplay: (deviceId: string, assetId: string) => Promise<any>;
      setDisplayMode: (deviceId: string, mode: string) => Promise<any>;
      setSelectedDisplay: (deviceId: string) => Promise<any>;
      selectLibraryAsset: (assetId: string) => Promise<any>;
    };
  }
}

export {};
