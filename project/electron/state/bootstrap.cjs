const { deviceRegistry } = require('./device-registry.cjs');
const { libraryState } = require('../ipc/library.handlers.cjs');
const { displayAssignments, displayModes } = require('../ipc/display.handlers.cjs');

function buildBootstrapState({ selectedDisplayId }) {
  return {
    ok: true,
    app: {
      mode: 'stabilization-first',
      priority: 'lcd-media-first',
    },

    devices: deviceRegistry.map((device) => ({
      ...device,
      assignedAssetId: displayAssignments[device.id] || null,
      mode: displayModes[device.id] || 'image',
    })),

    selectedDisplayId,

    library: libraryState.assets,
    selectedAssetId: libraryState.selectedAssetId,

    diagnostics: {
      backend: 'rebuild-placeholder',
      sync: 'unverified',
      statuses: [
        'linked-via-l-connect',
        'motherboard-handoff-indirect-sync',
        'standalone-display',
        'standalone-lighting',
        'unsupported-sync-path',
        'missing-offline-broken-link',
      ],
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
