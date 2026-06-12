const { deviceRegistry } = require('./device-registry.cjs');
const { libraryState } = require('../ipc/library.handlers.cjs');
const { displayAssignments, displayModes } = require('../ipc/display.handlers.cjs');
const { getLatestHardwareScan } = require('../ipc/diagnostics.handlers.cjs');

function getBackendStatus(scan, backendId) {
  return scan?.backends?.find((backend) => backend.id === backendId) || null;
}

function getDeviceStatus(device, scan) {
  if (!scan) return 'not-scanned';

  if (device.id === 'universal-screen-8-8') {
    const lConnect = getBackendStatus(scan, 'l_connect');
    return lConnect?.available ? `detected:${lConnect.confidence}` : 'not-detected';
  }

  if (device.id === 'jungle-leopard') {
    return 'standalone-detection-required';
  }

  return 'unknown';
}

function buildBootstrapState({ selectedDisplayId }) {
  const hardwareScan = getLatestHardwareScan();

  return {
    ok: true,
    app: {
      mode: hardwareScan ? 'hardware-detection-active' : 'stabilization-first',
      priority: 'lcd-media-first',
    },

    devices: deviceRegistry.map((device) => ({
      ...device,
      status: getDeviceStatus(device, hardwareScan),
      assignedAssetId: displayAssignments[device.id] || null,
      mode: displayModes[device.id] || 'image',
    })),

    selectedDisplayId,

    library: libraryState.assets,
    selectedAssetId: libraryState.selectedAssetId,

    diagnostics: {
      backend: hardwareScan?.summary || 'not-scanned',
      sync: hardwareScan?.sync || 'unverified',
      scannedAt: hardwareScan?.scannedAt || null,
      statuses: hardwareScan
        ? hardwareScan.backends.map(
            (backend) => `${backend.label}: ${backend.available ? backend.confidence : 'not-detected'}`,
          )
        : ['hardware-scan-not-run-yet'],
      hardware: hardwareScan,
    },

    pages: [
      'Home',
      'LCD / Media',
      'Library',
      'RGB (Advanced)',
      'Settings',
    ],
  };
}

module.exports = {
  buildBootstrapState,
};
