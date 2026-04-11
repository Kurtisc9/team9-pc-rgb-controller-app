const { ipcMain } = require('electron');
const { buildBootstrapState } = require('../state/bootstrap.cjs');
const { deviceRegistry } = require('../state/device-registry.cjs');

let selectedDisplayId = 'jungle-leopard';

function registerAppHandlers({ app }) {
  ipcMain.handle('team9:get-app-info', async () => ({
    appName: 'Team9 RGB Controller',
    version: app.getVersion(),
    isPackaged: app.isPackaged,
    platform: process.platform,
  }));

  ipcMain.handle('team9:get-state-bootstrap', async () => {
    return buildBootstrapState({ selectedDisplayId });
  });

  ipcMain.handle('team9:app-set-selected-display', async (_event, deviceId) => {
    const exists = deviceRegistry.some((device) => device.id === deviceId);

    if (!exists) {
      return {
        ok: false,
        reason: 'device-not-found',
      };
    }

    selectedDisplayId = deviceId;

    return {
      ok: true,
      selectedDisplayId,
    };
  });
}

module.exports = {
  registerAppHandlers,
};
