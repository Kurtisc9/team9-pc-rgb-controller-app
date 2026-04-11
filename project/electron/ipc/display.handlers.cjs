const { ipcMain } = require('electron');
const { deviceRegistry } = require('../state/device-registry.cjs');

const displayAssignments = {};
const displayModes = {};
const allowedModes = new Set(['image', 'video', 'clock', 'system', 'off']);

function deviceExists(deviceId) {
  return deviceRegistry.some((device) => device.id === deviceId);
}

function registerDisplayHandlers() {
  ipcMain.handle('team9:display-assign-asset', async (_event, payload) => {
    const { deviceId, assetId } = payload || {};

    if (!deviceId || !deviceExists(deviceId)) {
      return { ok: false, reason: 'device-not-found' };
    }

    if (!assetId || typeof assetId !== 'string') {
      return { ok: false, reason: 'invalid-asset-id' };
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

    if (!deviceId || !deviceExists(deviceId)) {
      return { ok: false, reason: 'device-not-found' };
    }

    if (!mode || typeof mode !== 'string' || !allowedModes.has(mode)) {
      return { ok: false, reason: 'invalid-mode' };
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