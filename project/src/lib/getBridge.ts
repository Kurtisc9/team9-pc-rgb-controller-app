export function getBridge() {
  if (!window.team9Bridge) {
    throw new Error('team9Bridge is unavailable. Preload may not be connected.');
  }

  return window.team9Bridge;
}
