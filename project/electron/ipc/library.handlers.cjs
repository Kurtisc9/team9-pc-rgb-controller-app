const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');

const libraryState = {
  selectedAssetId: null,
  assets: [],
};

function normalizeAsset(filePath) {
  const fileName = path.basename(filePath);
  return {
    id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: fileName,
    path: filePath,
    favorite: false,
    type: inferAssetType(fileName),
  };
}

function inferAssetType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) return 'image';
  if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
  return 'other';
}

function registerLibraryHandlers({ dialog }) {
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
    return added;
  });

  ipcMain.handle('team9:library-toggle-favorite', async (_event, assetId) => {
    const asset = libraryState.assets.find((item) => item.id === assetId);
    if (!asset) return { ok: false, reason: 'asset-not-found' };

    asset.favorite = !asset.favorite;
    return { ok: true, asset };
  });

  ipcMain.handle('team9:library-delete-asset', async (_event, assetId) => {
    const index = libraryState.assets.findIndex((item) => item.id === assetId);
    if (index === -1) return { ok: false, reason: 'asset-not-found' };

    const [removed] = libraryState.assets.splice(index, 1);

    if (libraryState.selectedAssetId === assetId) {
      libraryState.selectedAssetId = null;
    }

    return { ok: true, removed };
  });

  ipcMain.handle('team9:library-select-asset', async (_event, assetId) => {
    const asset = libraryState.assets.find((item) => item.id === assetId);
    if (!asset) return { ok: false, reason: 'asset-not-found' };

    libraryState.selectedAssetId = assetId;
    return { ok: true, selectedAssetId: assetId };
  });
}

module.exports = {
  registerLibraryHandlers,
  libraryState,
};
module.exports = {
  registerLibraryHandlers,
  libraryState,
};
