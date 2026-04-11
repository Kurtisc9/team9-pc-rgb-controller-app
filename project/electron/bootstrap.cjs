const { deviceRegistry } = require('./device-registry.cjs');

function buildBootstrapState({ selectedDisplayId }) {
  return {
    ok: true,
    app: {
      mode: 'stabilization-first',
      priority: 'lcd-media-first',
    },
    devices: deviceRegistry,
    selectedDisplayId,
    library: [],
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
