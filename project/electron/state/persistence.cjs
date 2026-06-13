const fs = require('fs');
const path = require('path');

let appRef = null;

function configurePersistence({ app }) {
  appRef = app;
}

function getStateFolder() {
  if (!appRef) {
    return path.join(process.cwd(), '.team9-state');
  }

  return path.join(appRef.getPath('documents'), 'Team9', 'State');
}

function ensureStateFolder() {
  const folder = getStateFolder();
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function getStateFilePath(fileName) {
  return path.join(ensureStateFolder(), fileName);
}

function readJson(fileName, fallbackValue) {
  try {
    const filePath = getStateFilePath(fileName);
    if (!fs.existsSync(filePath)) return fallbackValue;

    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return fallbackValue;

    return JSON.parse(raw);
  } catch (_error) {
    return fallbackValue;
  }
}

function writeJson(fileName, value) {
  const filePath = getStateFilePath(fileName);
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(tempPath, filePath);
  return filePath;
}

module.exports = {
  configurePersistence,
  getStateFolder,
  readJson,
  writeJson,
};
