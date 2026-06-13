const { ipcMain } = require('electron');
const { deviceRegistry } = require('../state/device-registry.cjs');
const { getLatestHardwareScan } = require('./diagnostics.handlers.cjs');

const displayAssignments = {};
const displayModes = {};
const stagedPresets = {};
const allowedModes = new Set(['image', 'video', 'clock', 'system', 'off']);
const allowedPresets = new Set(['off', 'static-white', 'static-red', 'static-green', 'static-blue', 'rainbow-preview']);

function deviceExists(deviceId) {
  return deviceRegistry.some((device) => device.id === deviceId);
}

function getDevice(deviceId) {
  return deviceRegistry.find((device) => device.id === deviceId) || null;
}

function getDetectedBackend(deviceId) {
  const scan = getLatestHardwareScan();
  const device = getDevice(deviceId);

  if (!scan || !device) return null;

  if (device.id === 'universal-screen-8-8') {
    return scan.backends.find((backend) => backend.id === 'l_connect' && backend.available) || null;
  }

  return null;
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

  ipcMain.handle('team9:display-stage-safe-preset', async (_event, payload) => {
    const { deviceId, presetId, confirmed } = payload || {};

    if (!deviceId || !deviceExists(deviceId)) {
      return { ok: false, reason: 'device-not-found' };
    }

    if (!presetId || !allowedPresets.has(presetId)) {
      return { ok: false, reason: 'invalid-preset' };
    }

    if (!confirmed) {
      return {
        ok: false,
        reason: 'confirmation-required',
        message: 'Preset staging requires confirmation.',
      };
    }

    const backend = getDetectedBackend(deviceId);

    if (!backend) {
      return {
        ok: false,
        reason: 'backend-not-detected',
        message: 'No supported backend detected for this device. Run Refresh Diagnostics first.',
      };
    }

    stagedPresets[deviceId] = {
      presetId,
      backendId: backend.id,
      backendLabel: backend.label,
      stagedAt: new Date().toISOString(),
      safeMode: true,
      dryRun: true,
    };

    return {
      ok: true,
      deviceId,
      presetId,
      backendId: backend.id,
      backendLabel: backend.label,
      dryRun: true,
      message: 'Preset staged in safe preview mode. No device values were changed.',
      state: stagedPresets[deviceId],
    };
  });
}

module.exports = {
  registerDisplayHandlers,
  displayAssignments,
  displayModes,
  stagedPresets,
};
