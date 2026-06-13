const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('team9Bridge', {
  getAppInfo: () => ipcRenderer.invoke('team9:get-app-info'),
  getStateBootstrap: () => ipcRenderer.invoke('team9:get-state-bootstrap'),
  refreshBackendHealth: () => ipcRenderer.invoke('team9:backend-refresh-scan'),
  exportDiagnosticsReport: () => ipcRenderer.invoke('team9:export-diagnostics-report'),
  runMachineCapture: () => ipcRenderer.invoke('team9:run-machine-capture'),
  openDiagnosticsFolder: () => ipcRenderer.invoke('team9:open-diagnostics-folder'),
  importLibraryFiles: () => ipcRenderer.invoke('team9:library-import-files'),
  toggleLibraryFavorite: (assetId) => ipcRenderer.invoke('team9:library-toggle-favorite', assetId),
  deleteLibraryAsset: (assetId) => ipcRenderer.invoke('team9:library-delete-asset', assetId),
  assignAssetToDisplay: (deviceId, assetId) =>
    ipcRenderer.invoke('team9:display-assign-asset', { deviceId, assetId }),
  setDisplayMode: (deviceId, mode) =>
    ipcRenderer.invoke('team9:display-set-mode', { deviceId, mode }),
  stageSafePreset: (deviceId, presetId, confirmed) =>
    ipcRenderer.invoke('team9:display-stage-safe-preset', { deviceId, presetId, confirmed }),
  setSelectedDisplay: (deviceId) =>
    ipcRenderer.invoke('team9:app-set-selected-display', deviceId),
  selectLibraryAsset: (assetId) =>
    ipcRenderer.invoke('team9:library-select-asset', assetId),
});
