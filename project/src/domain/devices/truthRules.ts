import type { DeviceRecord, SyncTruthStatus } from '@/domain/devices/types';

export const syncTruthLabelMap: Record<SyncTruthStatus, string> = {
  synced_true: 'Truly Synced',
  synced_indirect: 'Indirectly Matched',
  standalone: 'Standalone',
  available_not_linked: 'Available',
  unsupported: 'Unsupported',
  backend_missing: 'Backend Missing',
  unknown: 'Unknown',
};

export function getSyncTruthLabel(status: SyncTruthStatus): string {
  return syncTruthLabelMap[status];
}

export function canClaimTrueSync(device: DeviceRecord): boolean {
  if (device.id !== 'universal-screen-8-8') {
    return device.syncStatus === 'synced_true';
  }

  return (
    device.backendOwner === 'l_connect' &&
    device.syncStatus === 'synced_true' &&
    device.rgbState?.sourceLabel === 'L-Connect (Setting 20)'
  );
}

export function getDeviceSummary(device: DeviceRecord): string {
  switch (device.id) {
    case 'universal-screen-8-8':
      return 'Universal Screen 8.8" uses L-Connect as the real RGB sync path.';
    case 'jungle-leopard-display':
      return 'Jungle Leopard stays in the display lane and out of RGB presets.';
    case 'asus-tuf-rtx-4070-super-oc':
      return 'ASUS GPU truth depends on Aura / Armoury Crate availability.';
    case 'gscooler-holder-display':
      return 'GSCOOLER display path stays standalone.';
    case 'gscooler-holder-rgb':
      return 'GSCOOLER RGB path is separate from the display path.';
    default:
      return 'Device truth has not been fully classified yet.';
  }
}
