const { ipcMain } = require('electron');
const { deviceRegistry } = require('../state/device-registry.cjs');
const { getLatestHardwareScan } = require('./diagnostics.handlers.cjs');

const allowedPresets = new Set(['off', 'static-white', 'static-red', 'static-green', 'static-blue', 'rainbow-preview']);
const rgbPresetState = {};

function deviceExists(deviceId) {
  return deviceRegistry.some((device) => device.id === deviceId);
}

function getDevice(deviceId) {
  return deviceRegistry.find((device) => device.id === deviceId) || null;
}

function getSupportedBackendForDevice(deviceId) {
  const scan = getLatestHardwareScan();
  const device = getDevice(deviceId);

  if (!scan || !device) return null;

  if (device.id === 'universal-screen-8-8') {
    return scan.backends.find((backend) => backend.id === 'l_connect' && backend.available) || null;
  }

  if (device.rgbPath === 'motherboard-argb') {
    return scan.backends.find((backend) => backend.id === 'armoury_crate' && backend.available) || null;
  }

  return null;
}

function registerRgbHandlers() {
  ipcMain.handle('team9:rgb-apply-safe-preset', async (_event, payload) => {
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
        message: 'Safe RGB preset requires confirmation before applying.',
      };
    }

    const backend = getSupportedBackendForDevice(deviceId);
    const device = getDevice(deviceId);

    if (!backend) {
      return {
        ok: false,
        reason: 'no-safe-backend',
        message: 'No detected safe RGB backend is available for this device. Run Refresh Diagnostics first.',
      };
    }

    rgbPresetState[deviceId] = {
      presetId,
      backendId: backend.id,
      backendLabel: backend.label,
      appliedAt: new Date().toISOString(),
      safeMode: true,
      writeAccess: false,
      dryRun: true,
    };

    return {
      ok: true,
      dryRun: true,
      deviceId,
      deviceName: device.name,
      presetId,
      backendId: backend.id,
      backendLabel: backend.label,
      message: 'Preset staged in safe dry-run mode. No hardware values were changed.',
      state: rgbPresetState[deviceId],
    };
  });
}

module.exports = {
  registerRgbHandlers,
  rgbPresetState,
  allowedPresets: [...allowedPresets],
};
