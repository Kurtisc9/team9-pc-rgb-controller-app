const fs = require('fs');
const os = require('os');
const path = require('path');
const { ipcMain, shell } = require('electron');

function getDiagnosticsFolder(app) {
  const base = app.getPath('documents');
  return path.join(base, 'Team9', 'Diagnostics');
}

function ensureFolder(folderPath) {
  fs.mkdirSync(folderPath, { recursive: true });
}

function registerDiagnosticsHandlers({ app }) {
  ipcMain.handle('team9:backend-refresh-scan', async () => {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      backend: 'rebuild-placeholder',
      sync: 'unverified',
      note: 'Foundation rebuild active. Real backend scan not attached yet.',
    };
  });

  ipcMain.handle('team9:run-machine-capture', async () => {
    return {
      ok: true,
      machine: {
        platform: process.platform,
        arch: process.arch,
        hostname: os.hostname(),
        cpus: os.cpus().length,
        totalMemoryGB: Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(2)),
      },
    };
  });

  ipcMain.handle('team9:export-diagnostics-report', async () => {
    try {
      const folder = getDiagnosticsFolder(app);
      ensureFolder(folder);

      const report = {
        exportedAt: new Date().toISOString(),
        backend: 'rebuild-placeholder',
        sync: 'unverified',
        platform: process.platform,
        arch: process.arch,
        hostname: os.hostname(),
      };

      const fileName = `team9-diagnostics-${Date.now()}.json`;
      const filePath = path.join(folder, fileName);

      fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8');

      return {
        ok: true,
        filePath,
      };
    } catch (error) {
      return {
        ok: false,
        reason: 'export-failed',
        message: error instanceof Error ? error.message : 'Unknown export error',
      };
    }
  });

  ipcMain.handle('team9:open-diagnostics-folder', async () => {
    try {
      const folder = getDiagnosticsFolder(app);
      ensureFolder(folder);

      const openResult = await shell.openPath(folder);
      if (openResult) {
        return {
          ok: false,
          reason: 'open-path-failed',
          message: openResult,
        };
      }

      return { ok: true, folder };
    } catch (error) {
      return {
        ok: false,
        reason: 'open-folder-failed',
        message: error instanceof Error ? error.message : 'Unknown open error',
      };
    }
  });
}

module.exports = {
  registerDiagnosticsHandlers,
};