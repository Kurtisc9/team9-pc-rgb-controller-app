const path = require('path');
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { registerAppHandlers } = require('./ipc/app.handlers.cjs');
const { registerLibraryHandlers } = require('./ipc/library.handlers.cjs');
const { registerDisplayHandlers } = require('./ipc/display.handlers.cjs');
const { registerDiagnosticsHandlers } = require('./ipc/diagnostics.handlers.cjs');
const { configurePersistence } = require('./state/persistence.cjs');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#0b0f14',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

app.whenReady().then(() => {
  configurePersistence({ app });
  const mainWindow = createWindow();

  registerAppHandlers({ app });
  registerLibraryHandlers({ dialog });
  registerDisplayHandlers();
  registerDiagnosticsHandlers({ app });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
