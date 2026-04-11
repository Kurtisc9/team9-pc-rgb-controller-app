export function getBridge() {
  if (!window.team9Bridge) {
    throw new Error('team9Bridge is unavailable. Preload is not connected.');
  }

  return window.team9Bridge;
}
}
