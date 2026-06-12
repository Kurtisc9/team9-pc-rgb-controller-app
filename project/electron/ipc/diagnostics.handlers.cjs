const fs = require('fs');
const path = require('path');
const { ipcMain, shell } = require('electron');
const { detectHardware } = require('../hardware/detect-hardware.cjs');

let latestHardwareScan = null;

function getDiagnosticsFolder(app) {
  const base = app.getPath('documents');
  return path.join(base, 'Team9', 'Diagnostics');
}

function ensureFolder(folderPath) {
  fs.mkdirSync(folderPath, { recursive: true });
}

async function runHardwareScan() {
  latestHardwareScan = await detectHardware();
  return latestHardwareScan;
}

function getLatestHardwareScan() {
  return latestHardwareScan;
}

function registerDiagnosticsHandlers({ app }) {
  ipcMain.handle('team9:backend-refresh-scan', async () => {
    const scan = await runHardwareScan();

    return {
      ...scan,
      note: scan.summary,
    };
  });

  ipcMain.handle('team9:run-machine-capture', async () => {
    const scan = await runHardwareScan();

    return {
      ok: true,
      scannedAt: scan.scannedAt,
      machine: scan.machine,
      platform: scan.platform,
      arch: scan.arch,
      hostname: scan.hostname,
      backends: scan.backends,
      note: 'Machine capture complete with hardware backend evidence.',
    };
  });

  ipcMain.handle('team9:export-diagnostics-report', async () => {
    try {
      const folder = getDiagnosticsFolder(app);
      ensureFolder(folder);

      const scan = latestHardwareScan || (await runHardwareScan());
      const report = {
        exportedAt: new Date().toISOString(),
        ...scan,
      };

      const fileName = `team9-diagnostics-${Date.now()}.json`;
      const filePath = path.join(folder, fileName);

      fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8');

      return {
        ok: true,
        filePath,
        note: `Diagnostics report exported: ${filePath}`,
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
  runHardwareScan,
  getLatestHardwareScan,
};
