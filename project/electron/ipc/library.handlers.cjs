const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');
const { readJson, writeJson } = require('../state/persistence.cjs');

const LIBRARY_FILE = 'library-state.json';

const libraryState = {
  selectedAssetId: null,
  assets: [],
};

function loadLibraryState() {
  const saved = readJson(LIBRARY_FILE, libraryState);
  libraryState.selectedAssetId = saved.selectedAssetId || null;
  libraryState.assets = Array.isArray(saved.assets) ? saved.assets.filter((asset) => fs.existsSync(asset.path)) : [];

  if (libraryState.selectedAssetId && !libraryState.assets.some((asset) => asset.id === libraryState.selectedAssetId)) {
    libraryState.selectedAssetId = null;
  }

  saveLibraryState();
}

function saveLibraryState() {
  return writeJson(LIBRARY_FILE, libraryState);
}

function normalizeAsset(filePath) {
  const fileName = path.basename(filePath);
  return {
    id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: fileName,
    path: filePath,
    favorite: false,
    type: inferAssetType(fileName),
    importedAt: new Date().toISOString(),
  };
}

function inferAssetType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return 'image';
  if (['.gif'].includes(ext)) return 'gif';
  if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
  return 'other';
}

function registerLibraryHandlers({ dialog }) {
  loadLibraryState();

  ipcMain.handle('team9:library-import-files', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Media', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'webm', 'mov'] },
      ],
    });

    if (result.canceled || !result.filePaths?.length) {
      return [];
    }

    const existingPaths = new Set(libraryState.assets.map((asset) => asset.path));

    const added = result.filePaths
      .filter((filePath) => fs.existsSync(filePath))
      .filter((filePath) => !existingPaths.has(filePath))
      .map(normalizeAsset);

    libraryState.assets.push(...added);
    saveLibraryState();
    return added;
  });

  ipcMain.handle('team9:library-toggle-favorite', async (_event, assetId) => {
    const asset = libraryState.assets.find((item) => item.id === assetId);
    if (!asset) return { ok: false, reason: 'asset-not-found' };

    asset.favorite = !asset.favorite;
    saveLibraryState();
    return { ok: true, asset };
  });

  ipcMain.handle('team9:library-delete-asset', async (_event, assetId) => {
    const index = libraryState.assets.findIndex((item) => item.id === assetId);
    if (index === -1) return { ok: false, reason: 'asset-not-found' };

    const [removed] = libraryState.assets.splice(index, 1);

    if (libraryState.selectedAssetId === assetId) {
      libraryState.selectedAssetId = null;
    }

    saveLibraryState();
    return { ok: true, removed };
  });

  ipcMain.handle('team9:library-select-asset', async (_event, assetId) => {
    const asset = libraryState.assets.find((item) => item.id === assetId);
    if (!asset) return { ok: false, reason: 'asset-not-found' };

    libraryState.selectedAssetId = assetId;
    saveLibraryState();
    return { ok: true, selectedAssetId: assetId };
  });
}

module.exports = {
  registerLibraryHandlers,
  libraryState,
  loadLibraryState,
  saveLibraryState,
};
