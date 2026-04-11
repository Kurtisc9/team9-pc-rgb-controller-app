const { ipcMain } = require('electron');
const { deviceRegistry } = require('../state/device-registry.cjs');

const displayAssignments = {};
const displayModes = {};

function registerDisplayHandlers() {
  ipcMain.handle('team9:display-assign-asset', async (_event, payload) => {
    const { deviceId, assetId } = payload || {};
    if (!deviceRegistry.some((d) => d.id === deviceId)) {
      return { ok: false, reason: 'device-not-found' };
    }

    displayAssignments[deviceId] = assetId;
    return {
      ok: true,
      deviceId,
      assetId,
    };
  });

  ipcMain.handle('team9:display-set-mode', async (_event, payload) => {
    const { deviceId, mode } = payload || {};
    if (!deviceRegistry.some((d) => d.id === deviceId)) {
      return { ok: false, reason: 'device-not-found' };
    }

    displayModes[deviceId] = mode;
    return {
      ok: true,
      deviceId,
      mode,
    };
  });
}

module.exports = {
  registerDisplayHandlers,
  displayAssignments,
  displayModes,
};
